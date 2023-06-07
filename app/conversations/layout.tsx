import getConversations from "../actions/getConversations";
import Sidebar from "../components/sidebar/Sidebar";
import useConversation from "../hooks/useConversation";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    // @ts-expect-error
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
