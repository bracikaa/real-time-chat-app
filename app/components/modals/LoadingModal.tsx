"use client";

import { Transition } from "@headlessui/react";
import { Fragment } from "react";

const LoadingModal = () => {
  return (
    <Transition.Root
      show
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      leave="ease-in duration-200"
    >
      <div className="bg-gray-100"></div>
    </Transition.Root>
  );
};

export default LoadingModal;
