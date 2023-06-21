"use client";

import useThread from "@/app/hooks/useThread";
import { FullMessageType } from "@/app/types";
import { useRef, useState } from "react";
import MessageBox from "./MessageBox";

interface BodyProps {
  initialMessages: FullMessageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { threadId } = useThread();
  return (
    <div className="body flex-1 overflow-y-auto">
      {messages.map((message, i) => {
        return <MessageBox message={message} key={message.id} />;
      })}
      <div className="pt-24" ref={bottomRef}></div>
    </div>
  );
};

export default Body;
