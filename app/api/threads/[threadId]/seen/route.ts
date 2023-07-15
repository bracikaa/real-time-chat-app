import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  threadId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { threadId } = params;
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const thread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!thread) {
      return new NextResponse("Invalid thread", { status: 400 });
    }

    const lastMessage = thread.messages[thread.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(thread);
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, "thread:update", {
      id: threadId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(thread);
    }

    await pusherServer.trigger(threadId!, "message:update", updatedMessage);

    return new NextResponse("Success");
  } catch (error) {
    console.log(error, "ERROR_MESSAGES_SEEN");
    return new NextResponse("Error", { status: 500 });
  }
}
