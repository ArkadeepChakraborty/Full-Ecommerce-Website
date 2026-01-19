// import { useState } from "react";
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from "../../Library/constant/Navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { IoFastFood } from "react-icons/io5";
import { Link } from "react-router-dom";

const classload =
  "flex items-center gap-2 font-light text-white cursor-pointer px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base";

const Sidebar = () => {
  
  const Logout = async () => {
    try {
      // ✅ Call correct backend logout API
      await fetch("http://localhost:8000/api/v1/adminRoute/admin/logout", {
        method: "GET",
        credentials: "include", 
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Remove local state if any
      localStorage.removeItem("loggedUser");

      // ✅ Redirect to LOGIN PAGE ("/")
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col w-60 p-3 bg-neutral-900 text-white">
      <div className="flex items-center gap-2 px-1 py-3">
        <IoFastFood fontSize={24} className="text-yellow-400" />
        <span className="text-violet-300 text-xl font-semibold">
          Food Faction
        </span>
      </div>

      <div className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>

      <div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}

        {/* LOGOUT BUTTON */}
        <div
          onClick={Logout}
          className="text-red-500 flex items-center gap-2 font-light cursor-pointer px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base"
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  );
};

function SidebarLink({ item }) {
  return (
    <Link to={item.path} className={classload}>
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}

export default Sidebar;
