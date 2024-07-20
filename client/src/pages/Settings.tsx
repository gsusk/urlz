import { Link, Outlet } from "react-router-dom";
import { FaUser, FaLock, FaKey } from "react-icons/fa";

import "./Settings.css";

function Settings() {
  return (
    <div className="h-container">
      <div className="settings-page-container">
        <div className="settings-sections">
          <nav className="settings-sections-nav">
            <h2>SETTINGS</h2>
            <Link to={"profile"} className="account_siderbar_button">
              <FaUser />
              Profile
            </Link>
            <Link to={"security"} className="account_siderbar_button">
              <FaLock />
              Security
            </Link>
            <Link to={"api"} className="account_siderbar_button">
              <FaKey />
              API
            </Link>
            <h2>BILLING</h2>
            <Link to={"/pricing"} className="account_siderbar_button">
              Billing
            </Link>
            <Link to={"invoices"} className="account_siderbar_button">
              Billing
            </Link>
          </nav>
        </div>
        <div>
          <section className="">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
