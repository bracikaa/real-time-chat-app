import getCurrentUser from "./getCurrentUser";

export default async function getThreadById(threadId: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const thread = await prisma?.thread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        users: true,
      },
    });

    return thread;
  } catch (error: any) {
    return null;
  }
}
