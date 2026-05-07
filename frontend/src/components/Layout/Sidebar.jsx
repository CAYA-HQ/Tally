import { NavLink } from "react-router-dom"; // MUST IMPORT THIS
import { RiDashboardLine } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuClipboardList } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import Logo from "../Logo";
import "../../styles/layout/sidebar.css";
import logogroup from "../../assets/logogroup.svg";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <RiDashboardLine />, path: "/dashboard" },
  { id: "inventory", label: "Inventory", icon: <MdOutlineInventory2 />, path: "/dashboard/inventory" },
  { id: "orders",    label: "Orders",    icon: <BsCart3 />, path: "/dashboard/orders" },
  { id: "reports",   label: "Reports",   icon: <HiOutlineDocumentReport />, path: "/dashboard/reports" },
  { id: "record",    label: "Record",    icon: <LuClipboardList />, path: "/dashboard/record" },
];

export default function Sidebar() {
  return (
    <aside className="tally-sidebar">
      {/* Logo */}
      <div className="tally-logo">
        <img src={logogroup} alt="Tally Logo" className="tally-img" />
        <Logo />
      </div>

      {/* Main nav - Using NavLink instead of buttons */}
      <nav className="tally-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            // isActive is provided by React Router automatically
            className={({ isActive }) => 
              `tally-nav-item${isActive ? " active" : ""}`
            }
            // Use 'end' for dashboard so it's not active when on /inventory
            end={item.id === "dashboard"}
          >
            <span className="tally-nav-icon">{item.icon}</span>
            <span className="tally-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="tally-divider" />

      {/* Bottom nav */}
      <div className="tally-bottom">
        <button className="tally-nav-item">
          <span className="tally-nav-icon"><IoSettingsOutline /></span>
          <span className="tally-nav-label">Settings</span>
        </button>
        <button className="tally-nav-item">
          <span className="tally-nav-icon"><LuLogOut /></span>
          <span className="tally-nav-label">Log out</span>
        </button>
      </div>
    </aside>
  );
}