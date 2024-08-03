import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Security() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [inputTypes, setInputTypes] = useState({
    currentPassword: "password",
    password: "password",
    confirmPassword: "password",
  });
  const [error, setError] = useState<Record<string, string>>({});

  const handleToggleVisibility = (field: keyof typeof inputTypes) => {
    setInputTypes((prev) => ({
      ...prev,
      [field]: prev[field] === "password" ? "text" : "password",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError({ message: "Passwords do not match" });
      return;
    }
    //fetch
  };

  return (
    <div className="out-sec panel-pdl">
      <div className="profile-container panel panel-border">
        <h4>Security</h4>
        <h2>Update Password</h2>
        <div className="uw">
          <div className="mw">
            <form action="form row-container" onSubmit={handleSubmit}>
              <div className="inner-sec-form">
                <div className="row-container">
                  <label
                    htmlFor="currentPassword"
                    className="security-label-column"
                  >
                    Current Password
                  </label>
                  <div className="security-input-column">
                    <input
                      type={inputTypes.currentPassword}
                      name="currentPassword"
                      id="currentPassword"
                      className="shortener-input relative-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button className="button-toggle-input" type="button">
                      {inputTypes.currentPassword === "text" ? (
                        <FaRegEyeSlash
                          className=""
                          onClick={() =>
                            handleToggleVisibility("currentPassword")
                          }
                        />
                      ) : (
                        <FaRegEye
                          className=""
                          onClick={() =>
                            handleToggleVisibility("currentPassword")
                          }
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="row-container">
                  <label htmlFor="password" className="security-label-column">
                    Password
                  </label>
                  <div className="security-input-column">
                    <input
                      type={inputTypes.password}
                      name="password"
                      id="password"
                      className="shortener-input relative-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button-toggle-input" type="button">
                      {inputTypes.password === "text" ? (
                        <FaRegEyeSlash
                          className=""
                          onClick={() => handleToggleVisibility("password")}
                        />
                      ) : (
                        <FaRegEye
                          className=""
                          onClick={() => handleToggleVisibility("password")}
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="row-container">
                  <label
                    htmlFor="confirmPassword"
                    className="security-label-column"
                  >
                    Confirm Password
                  </label>
                  <div className="security-input-column ">
                    <input
                      type={inputTypes.confirmPassword}
                      name="confirmPassword"
                      id="confirmPassword"
                      className="shortener-input relative-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button className="button-toggle-input" type="button">
                      {inputTypes.confirmPassword === "text" ? (
                        <FaRegEyeSlash
                          className=""
                          onClick={() =>
                            handleToggleVisibility("confirmPassword")
                          }
                        />
                      ) : (
                        <FaRegEye
                          className=""
                          onClick={() =>
                            handleToggleVisibility("confirmPassword")
                          }
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div className="row-container">
                  <div className="sec-update-button">
                    <button type="submit" className="button __vmc">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="profile-container panel">
        <div style={{ padding: "0 0.8rem" }}>
          <h4>Additional Security</h4>
          <h2>Two-Factor Authentication</h2>
          <p>
            Add an extra layer of security to your account by enabling
            Two-Factor Authentication.{" "}
          </p>
        </div>
      </div>
      <div>{error.message}</div>
    </div>
  );
}

export default Security;
