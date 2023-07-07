import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, threadId, image } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        thread: {
          connect: {
            id: threadId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedThread = await prisma.thread.update({
      where: {
        id: threadId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(threadId, "messages:new", newMessage);

    const lastMessage =
      updatedThread.messages[updatedThread.messages.length - 1];

    updatedThread.users.map((user) => {
      pusherServer.trigger(user.email!, "thread:update", {
        id: threadId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Error", { status: 500 });
  }
}
