import getThreads from "../actions/getThreads";
import Sidebar from "../components/sidebar/Sidebar";
import ThreadList from "./components/ThreadList";

export default async function ThreadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const threads = await getThreads();

  return (
    // @ts-expect-error
    <Sidebar>
      <div className="h-full">
        <ThreadList initialItems={threads} />
        {children}
      </div>
    </Sidebar>
  );
}
