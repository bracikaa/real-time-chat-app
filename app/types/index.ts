import { Thread, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullThreadType = Thread & {
  users: User[];
  messages: FullMessageType[];
};