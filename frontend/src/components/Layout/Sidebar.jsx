import { useState } from "react";
import { RiDashboardLine } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuClipboardList } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import Logo from "../Logo";
import "../../styles/layout/sidebar.css";
import Navbar from "./Navbar";
import logogroup from "../../assets/logogroup.svg";


const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <RiDashboardLine /> },
  { id: "inventory", label: "Inventory",  icon: <MdOutlineInventory2 /> },
  { id: "orders",    label: "Orders",     icon: <BsCart3 /> },
  { id: "reports",   label: "Reports",    icon: <HiOutlineDocumentReport /> },
  { id: "record",    label: "Record",     icon: <LuClipboardList /> },
];

const BOTTOM_ITEMS = [
  { id: "settings", label: "Settings", icon: <IoSettingsOutline /> },
  { id: "logout",   label: "Log out",  icon: <LuLogOut /> },
];

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="tally-layout">

      {/* ── Sidebar ── */}
      <aside className="tally-sidebar">

        {/* Logo */}
        <a href="#" className="tally-logo">
          <img src={logogroup} alt="Tally Logo" className="tally-img" />
          <Logo />
        </a>

        {/* Main nav */}
        <nav className="tally-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`tally-nav-item${active === item.id ? " active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className="tally-nav-icon">{item.icon}</span>
              <span className="tally-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="tally-divider" />

        {/* Bottom nav */}
        <div className="tally-bottom">
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`tally-nav-item${active === item.id ? " active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <span className="tally-nav-icon">{item.icon}</span>
              <span className="tally-nav-label">{item.label}</span>
            </button>
          ))}
        </div>

      </aside>

    </div>
  );
}