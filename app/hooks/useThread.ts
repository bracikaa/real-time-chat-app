import { useParams } from "next/navigation";
import { useMemo } from "react";

const useThread = () => {
  const params = useParams();
  const threadId = useMemo(() => {
    if (!params?.threadId) {
      return "";
    }

    return params.threadId as string;
  }, [params?.threadId]);

  const isOpen = useMemo(() => !!threadId, [threadId]);

  return useMemo(
    () => ({
      isOpen,
      threadId,
    }),
    [isOpen, threadId]
  );
};

export default useThread;
