import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useThread from "./useThread";

const threadsUrl = "/threads";
const usersUrl = "/users";

const useRoutes = () => {
  const pathName = usePathname();
  const { threadId } = useThread();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: threadsUrl,
        icon: HiChat,
        active: pathName === threadsUrl || !!threadId,
      },
      {
        label: "Users",
        href: usersUrl,
        icon: HiUsers,
        active: pathName === usersUrl,
      },
      {
        label: "Logout",
        href: "#",
        icon: HiArrowLeftOnRectangle,
        onClick: () => signOut(),
      },
    ],
    [pathName, threadId]
  );

  return routes;
};

export default useRoutes;
