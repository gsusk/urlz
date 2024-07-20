import { Link, Outlet } from "react-router-dom";
import { FaUser, FaLock, FaKey } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { FaFileInvoice } from "react-icons/fa";
import "./Settings.css";

function Settings() {
  return (
    <div className="h-container">
      <div className="settings-page-container">
        <div className="settings-sections">
          <nav className="settings-sections-nav">
            <h2>SETTINGS</h2>
            <Link to={"profile"} className="account_siderbar_button">
              <FaUser className="account-sidebar-icon" />
              Profile
            </Link>
            <Link to={"security"} className="account_siderbar_button">
              <FaLock className="account-sidebar-icon" />
              Security
            </Link>
            <Link to={"api"} className="account_siderbar_button">
              <FaKey className="account-sidebar-icon" />
              API
            </Link>
            <h2>BILLING</h2>
            <Link to={"/pricing"} className="account_siderbar_button">
              <TfiReload className="account-sidebar-icon" />
              Subscription
            </Link>
            <Link to={"invoices"} className="account_siderbar_button">
              <FaFileInvoice className="account-sidebar-icon" />
              Invoices
            </Link>
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
