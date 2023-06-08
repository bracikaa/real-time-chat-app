import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullThreadType } from "../types";

const useOtherUser = (
  thread: FullThreadType | { users: User[] }
) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = thread?.users.filter((user) => {
      user.email !== currentUserEmail;
    });

    return otherUser && otherUser[0];
  }, [session?.data?.user?.email, thread?.users]);

  return otherUser;
};

export default useOtherUser;
