import {
  NavLink,
  Outlet,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { FaUser, FaLock, FaKey } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { FaFileInvoice } from "react-icons/fa";
import "./Settings.css";

function Settings() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];

  return (
    <div className="h-container">
      <div className="settings-page-container">
        <div className="settings-sections">
          <nav className="settings-sections-nav" aria-details="navbar">
            <h2>SETTINGS</h2>
            <NavLink to={"profile"} className="account_siderbar_button">
              <FaUser className="account-sidebar-icon" />
              Profile
            </NavLink>
            <NavLink to={"security"} className="account_siderbar_button">
              <FaLock className="account-sidebar-icon" />
              Security
            </NavLink>
            <NavLink to={"api"} className="account_siderbar_button">
              <FaKey className="account-sidebar-icon" />
              API
            </NavLink>
            <h2>BILLING</h2>
            <NavLink to={"/pricing"} className="account_siderbar_button">
              <TfiReload className="account-sidebar-icon" />
              Subscription
            </NavLink>
            <NavLink to={"invoices"} className="account_siderbar_button">
              <FaFileInvoice className="account-sidebar-icon" />
              Invoices
            </NavLink>
          </nav>
        </div>
        <div className="profile-page-section">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Settings;
