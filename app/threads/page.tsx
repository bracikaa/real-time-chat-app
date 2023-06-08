"use client";

import clsx from "clsx";
import EmptyState from "../components/EmptyState";
import useThread from "../hooks/useThread";

const Home = () => {
  const { isOpen } = useThread();

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
