"use client";

import useThread from "@/app/hooks/useThread";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { threadId } = useThread();

  useEffect(() => {
    axios.post(`/api/threads/${threadId}/seen`);
  }, [threadId]);

  useEffect(() => {
    pusherClient.subscribe(threadId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/threads/${threadId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });
      
      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id == newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(threadId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [threadId]);

  return (
    <div className="body flex-1 overflow-y-auto">
      {messages.map((message, i) => {
        return (
          <MessageBox
            isLast={i === messages.length - 1}
            message={message}
            key={message.id}
          />
        );
      })}
      <div className="pt-24" ref={bottomRef}></div>
    </div>
  );
};

export default Body;
