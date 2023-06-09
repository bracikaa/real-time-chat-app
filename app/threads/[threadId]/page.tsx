import getMessages from "@/app/actions/getMessages";
import getThreadById from "@/app/actions/getThreadById";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";

interface ThreadIdParams {
  threadId: string;
}

const ThreadId = async ({ params }: { params: ThreadIdParams }) => {
  const thread = await getThreadById(params.threadId);
  const messages = await getMessages(params.threadId);

  if (!thread) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header thread={thread} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ThreadId;
