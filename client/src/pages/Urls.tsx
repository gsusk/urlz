import { FaUser, FaLock, FaKey, FaFileInvoice } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import "./Settings.css";

function Urls() {
  return (
    <div className="h-container">
      <div className="settings-page-container">
        <div className="settings-sections">
          <nav className="settings-sections-nav" aria-details="navbar">
            <h2 className="settings-sidebar-title">SETTINGS</h2>
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
            <h2 className="settings-sidebar-title">BILLING</h2>
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
        <div>sadasS</div>
      </div>
    </div>
  );
}

export default Urls;
