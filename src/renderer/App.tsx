import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useNetworkChange } from "./hooks/useNetworkChange";

import Home from "./routes/Home/Home";
import { Profile } from "./routes/Profile/Profile";
import { setLoading } from "./store/AppSlice";

/**
 *
 * @returns App layout
 */
function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isLoading = useSelector((state: any) => state.App.isLoading);
  const dispatch = useDispatch();

  useNetworkChange((error, isOnline) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Network status changed to ${isOnline}`);
    }
  });

  useEffect(() => {
    console.log();
    window.lanternAPI.loadLantern();
    window.lanternAPI.listenLoadLanternReply((args) => {
      const { success, error } = args;

      // If success load the launcher
      if (success) {
        console.log("Load Lantern success");
        dispatch(setLoading(false));
        return;
      }
      // no
      // Otherwise, throw error
      throw new Error(error.message);
    });
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
