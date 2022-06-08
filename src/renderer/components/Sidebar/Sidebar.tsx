import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiList } from "react-icons/fi";
import { HiHome } from "react-icons/hi";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [leftMenuItemList] = useState([
    {
      name: "Home",
      path: "/",
      icon: <HiHome />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FiList />,
    },
  ]);

  useEffect(() => {
    console.log("[Sidebar] Mounted");
    console.log(`[Sidebar] location.pathname: ${location.pathname}`);
  }, []);

  return (
    <div
      className="sidebar_wrapper fixed top-[42px] left-0 w-[64px] h-full bg-primary-900
    flex flex-col"
    >
      <div className="sidebar__header mt-12"></div>
      <div className="sidebar__container text-primary-400 flex flex-col gap-2 ">
        {leftMenuItemList.map((item) => (
          <div
            key={item.name}
            className={`flex flex-col justify-center items-center`}
          >
            <button
              className={`text-xl py-3 px-5 flex flex-col justify-center items-center
            hover:bg-primary-800 rounded-md transition-colors duration-200 mx-4 ${
              location.pathname === item.path &&
              `bg-primary-300 text-primary-800 hover:bg-primary-400`
            }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
