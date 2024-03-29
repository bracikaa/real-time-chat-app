import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newThread = await prisma.thread.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => {
                return { id: member.value };
              }),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newThread.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "thread:new", newThread);
        }
      });

      return NextResponse.json(newThread);
    }

    const existingThread = await prisma.thread.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleThread = existingThread[0];
    if (singleThread) {
      return NextResponse.json(singleThread);
    }

    const newThread = await prisma.thread.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    newThread.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "thread:new", newThread);
      }
    });

    return NextResponse.json(newThread);
  } catch (error: any) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
