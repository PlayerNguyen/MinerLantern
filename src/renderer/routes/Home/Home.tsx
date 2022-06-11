import React, { useEffect, useRef, useState } from "react";
import { HiViewList } from "react-icons/hi";

import useClickOutside from "../../hooks/useClickOutside";
import { useCurrentProfile } from "../../hooks/preload/useCurrentProfile";
import { useConfiguredProfile } from "../../hooks/preload/useConfiguredProfile";
import { useSelector } from "react-redux";
import { LauncherReducer } from "../../Index";

function Selector() {
  const [expand, setExpand] = useState(false);
  const currentDropdown = useRef(null);
  const { profile } = useConfiguredProfile();
  const { currentProfileIndex } = useCurrentProfile();
  const config = useSelector((state: LauncherReducer) => state.App.config);

  const onSelect = (index) => {
    // console.log(index);
    window.lanternAPI.send("update-setting", {
      ...config,
      currentProfileIndex: index,
    });
  };

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
            {profile && profile.profiles[currentProfileIndex].name}
          </div>
          <span className="p-2">
            <HiViewList />
          </span>
        </div>

        <div
          className={`bg-primary-100 text-primary-800 rounded-lg w-[140px] 
          max-h-[300px] overflow-y-scroll mt-1 ${
            expand ? "absolute" : ` hidden`
          }`}
          ref={currentDropdown}
        >
          {profile &&
            profile.profiles.map((_, i) => (
              <div
                key={i}
                className={`hover:bg-primary-300 px-2 py-2 rounded-lg flex flex-col cursor-default`}
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
  const [username, setUsername] = useState("");
  const [isUsernameValid, setUsernameValid] = useState<boolean>(false);
  const config = useSelector((state: LauncherReducer) => state.App.config);

  const isMinecraftUsername = (text) => {
    return (
      text.length >= 3 && text.length <= 16 && new RegExp(/^\w+$/i).test(text)
    );
  };

  useEffect(() => {
    console.log(`[Home] Mounted`);
  }, []);

  useEffect(() => {
    // Set the username to last username that player used
    if (config && config.offline.lastUsername) {
      setUsername(config.offline.lastUsername);
      setUsernameValid(isMinecraftUsername(config.offline.lastUsername));
    }
  }, [config]);

  const handleChangeUsername = ({ target }) => {
    setUsername(target.value);
    console.log();
    const _clone = { ...config, offline: { lastUsername: target.value } };
    window.lanternAPI.send("update-setting", _clone);

    setUsernameValid(isMinecraftUsername(target.value));
  };

  const handleExecuteMinecraft = () => {
    console.log(`[Home] Execute Minecraft`);
    
    window.lanternAPI.send("run-minecraft", [
      {
        url: "https://launchermeta.mojang.com/v1/packages/4d2c1138477c7aafe8fb370de11ea5b23a963edc/1.19.json",
        to: "../1.19.json",
        hash: "4d2c1138477c7aafe8fb370de11ea5b23a963edc",
      },
      {
        url: "https://launcher.mojang.com/v1/objects/c0898ec7c6a5a2eaa317770203a1554260699994/client.jar",
        to: "../client.jar",
        hash: "c898ec7c6a5a2eaa317770203a1554260699994",
      },
    ]);
  };

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
                  value={username}
                  onChange={handleChangeUsername}
                />
                {/* Old-fashion style (deprecated) */}
                {/* <button className="bg-green-600 px-3 py-1 text-2xl rounded-lg">
                  <HiPlay />
                </button> */}
              </div>
            </div>
            <div className="flex flex-col">
              <button
                className={`px-4 py-2 text-md rounded-lg w-full font-bold ${
                  isUsernameValid
                    ? "bg-green-600 "
                    : "bg-primary-600 text-primary-900 "
                }`}
                disabled={!isUsernameValid}
                onClick={() => {
                  handleExecuteMinecraft();
                }}
              >
                Enter Minecraft universes
              </button>
            </div>
          </div>
          {/* Right group */}
          <div className="">
            <div className="flex flex-col">
              <Selector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
