import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IDeleteParams {
  threadId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IDeleteParams }
) {
  try {
    const { threadId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingThread = await prisma.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        users: true,
      },
    });

    if (!existingThread) {
      return new NextResponse("Invalid Thread ID", { status: 400 });
    }

    const deletedThread = await prisma.thread.deleteMany({
      where: {
        id: threadId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    if (!existingThread) {
      return new NextResponse("Invalid Remove", { status: 400 });
    }

    return NextResponse.json(deletedThread);
  } catch (error) {
    console.log(error, "ERROR_THREAD_DELETE");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
