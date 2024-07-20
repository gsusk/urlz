import { Link, Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./Settings.css";

function Settings() {
  return (
    <div className="h-container">
      <div className="settings-page-container">
        <div className="settings-sections">
          <nav className="settings-sections-nav">
            <h2>SETTINGS</h2>
            <Link to={"/settings"} className="account_siderbar_button">
              <FaUser />
              Profile
            </Link>
            <Link to={"/security"} className="account_siderbar_button">
              Security
            </Link>
            <Link to={"/api"} className="account_siderbar_button">
              API
            </Link>
            <h2>BILLING</h2>
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
