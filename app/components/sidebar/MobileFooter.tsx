"use client";

import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";
import useThread from "@/app/hooks/useThread";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useThread();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
      {routes.map((route) => {
        return (
          <MobileItem
          label={route.label}
            key={route.label}
            href={route.href}
            icon={route.icon}
            active={route.active}
            onClick={route.onClick}
          />
        );
      })}
    </div>
  );
};

export default MobileFooter;
