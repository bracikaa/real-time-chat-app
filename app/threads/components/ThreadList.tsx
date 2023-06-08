"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import useThread from "@/app/hooks/useThread";
import { FullThreadType } from "@/app/types";
import ThreadBox from "./ThreadBox";

interface ThreadListProps {
  initialItems: FullThreadType[];
}

const ThreadList: React.FC<ThreadListProps> = ({
  initialItems,
}) => {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();
  const { threadId, isOpen } = useThread();
  return (
    <aside
      className={clsx(
        "thread-list fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
        isOpen ? "hidden" : "block w-full left-0"
      )}
    >
      <div className="px-5">
        <div className="flex justify-between mb-4 pt-4">
          <div className="text-2xl font-bold text-neutral-800">Messages</div>
          <div className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition">
            <MdOutlineGroupAdd size={20} />
          </div>
        </div>
        {items.map((item) => {
          return <ThreadBox key={item.id} data={item} />;
        })}
      </div>
    </aside>
  );
};

export default ThreadList;
