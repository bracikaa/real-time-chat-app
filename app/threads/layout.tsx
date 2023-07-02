import getThreads from "../actions/getThreads";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ThreadList from "./components/ThreadList";

export default async function ThreadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const threads = await getThreads();
  const users = await getUsers();

  return (
    // @ts-expect-error
    <Sidebar>
      <div className="h-full">
        <ThreadList initialItems={threads} users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
