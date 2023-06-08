import getCurrentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismadb";

const getThreads = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const thread = await prisma?.thread.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return thread;
  } catch (error) {
    return [];
  }
};

export default getThreads;
