interface ThreadIdParams {
  threadId: string;
}

const ThreadId = async ({ params }: { params: ThreadIdParams }) => {
  return <div>Test</div>;
};

export default ThreadId;
