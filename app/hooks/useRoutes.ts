import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";

const conversationsUrl = "/conversations";
const usersUrl = "/users";

const useRoutes = () => {
  const pathName = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: conversationsUrl,
        icon: HiChat,
        active: pathName === conversationsUrl || !!conversationId,
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
    [pathName, conversationId]
  );

  return routes;
};

export default useRoutes;
