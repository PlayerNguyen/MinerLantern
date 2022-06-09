import React, { useEffect, useRef, useState } from "react";
import { HiViewList } from "react-icons/hi";

import useClickOutside from "../../hooks/useClickOutside";
import { useCurrentProfile } from "../../hooks/preload/useCurrentProfile";
import { useConfiguredProfile } from "../../hooks/preload/useConfiguredProfile";

interface SelectorProps {
  onSelect: (index: number) => void;
}

function Selector({ onSelect }: SelectorProps) {
  const [expand, setExpand] = useState(false);
  const currentDropdown = useRef(null);

  const { profile, isLoading: isProfileLoading } = useConfiguredProfile();
  const { currentProfileIndex, isLoading: isCurrentProfileIndexLoading } =
    useCurrentProfile();

  useClickOutside(currentDropdown, () => {
    setExpand(false);
  });

  return (
    <div className="">
      <div
        className="bg-primary-100 border-2 border-primary-900 rounded-lg text-primary-600
          cursor-pointer w-[140px] relative inline-block"
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <div className="flex flex-row items-center px-2 py-1">
          <div className=" font-bold flex-1">
            {profile &&
              !isCurrentProfileIndexLoading &&
              profile.profiles[currentProfileIndex].name}
          </div>
          <span className="p-2">
            <HiViewList />
          </span>
        </div>

        <div
          className={`bg-primary-100 text-primary-800 rounded-lg w-[140px] 
            m-h-[300px] overflow-y-scroll mt-1 ${
              expand ? "absolute" : ` hidden`
            }`}
          ref={currentDropdown}
        >
          {!isProfileLoading &&
            profile &&
            profile.profiles.map((_, i) => (
              <div
                key={i}
                className={`hover:bg-primary-300 px-2 py-2 rounded-lg flex flex-col  cursor-default`}
                onClick={() => {
                  onSelect(i);
                }}
              >
                <span className="font-bold">{_.name}</span>
                <span className="text-primary-400 text-sm">{_.version}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Home() {
  useEffect(() => {
    console.log(`[Home] Mounted`);
  }, []);

  return (
    <div className="home__wrapper text-primary-100">
      {/* Header */}
      <div className="home__header p-3 bg-primary-900">
        <h1 className="text-3xl font-bold">Home</h1>
      </div>
      {/* Form */}
      <div className="home__form bg-primary-900">
        <div className="p-4 flex flex-row  gap-3">
          {/* Left group */}
          <div className="w-1/3 flex flex-col gap-2">
            <div className="flex flex-col">
              {/* <label className="text-white">Username</label> */}
              <div className="flex flex-row">
                <input
                  className="bg-primary-100 border-2 border-primary-900 rounded-lg p-2 text-primary-800 w-full"
                  type="text"
                  placeholder="Name"
                />
                {/* Old-fashion style (deprecated) */}
                {/* <button className="bg-green-600 px-3 py-1 text-2xl rounded-lg">
                  <HiPlay />
                </button> */}
              </div>
            </div>
            <div className="flex flex-col">
              <button className="bg-green-600 px-4 py-2 text-md rounded-lg w-full">
                Enter Minecraft universe
              </button>
            </div>
          </div>
          {/* Right group */}
          <div className="">
            <div className="flex flex-col">
              <Selector
                onSelect={(i: number) => {
                  console.log(i);
                }}
              />
              {/* <div className="flex flex-row gap-2">
                <input
                  className="bg-primary-100 border-2 border-primary-900 rounded-lg p-2 text-primary-800"
                  type="password"
                  placeholder="Password"
                />
                <button className="bg-green-600 px-3 py-1 text-2xl rounded-lg">
                  <HiPlay />
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
