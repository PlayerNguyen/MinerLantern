import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useLanternLauncherLoad } from "./hooks/preload/useLanternLauncherLoad";

import { useNetworkChange } from "./hooks/useNetworkChange";
import { ListenerReceiver } from "./listener/ListenerReceiver";

import Home from "./routes/Home/Home";
import { Profile } from "./routes/Profile/Profile";
import {
  setConfig,
  setLoading,
  setProfile,
  setVersionManifest,
} from "./store/AppSlice";

/**
 *
 * @returns App layout
 */
function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoading = useSelector((state: any) => state.App.isLoading);
  const dispatch = useDispatch();

  useNetworkChange({
    onChange: (isOnline: boolean) => {
      dispatch(setLoading(isOnline));

      if (!isOnline) {
        console.error("📴 Network is offline");
      }
    },
  });

  /**
   * Initialize Miner Lantern Launcher
   */
  useLanternLauncherLoad({
    onError: (error) => {
      throw new Error(error.message);
    },
    onLoad: (version, profile, config) => {
      dispatch(setVersionManifest(version));
      dispatch(setProfile(profile));
      dispatch(setConfig(config));

      // dispatch(setLoading(false));

      console.log(`🇻🇳 Lantern Launcher loaded`);
    },
  });

  /**
   * Hooks all listeners
   */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ListenerReceiver.handle(dispatch);
  }, []);

  return (
    <>
      <MemoryRouter>
        {/* Header */}
        <Header />

        <Sidebar />

        <div
          className={`fixed left-[64px] top-[42px] w-full h-full bg-primary-800 ${
            isLoading && `items-center justify-center`
          }`}
        >
          <Routes>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </MemoryRouter>
    </>
  );
}

export default App;
