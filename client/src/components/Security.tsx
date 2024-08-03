import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { updatePassword } from "../services/user";

function Security() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    //fetch
    try {
      const res = await updatePassword(
        password,
        currentPassword,
        confirmPassword
      );
      if (res.status === 200) {
        setPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
        setError({});
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
                    <button
                      className="button-toggle-input"
                      type="button"
                      onClick={() => handleToggleVisibility("currentPassword")}
                    >
                      {inputTypes.currentPassword === "text" ? (
                        <FaRegEyeSlash className="" />
                      ) : (
                        <FaRegEye className="" />
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
                    <button
                      className="button-toggle-input"
                      type="button"
                      onClick={() => handleToggleVisibility("password")}
                    >
                      {inputTypes.password === "text" ? (
                        <FaRegEyeSlash className="" />
                      ) : (
                        <FaRegEye className="" />
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
                    <button
                      className="button-toggle-input"
                      type="button"
                      onClick={() => handleToggleVisibility("confirmPassword")}
                    >
                      {inputTypes.confirmPassword === "text" ? (
                        <FaRegEyeSlash className="" />
                      ) : (
                        <FaRegEye className="" />
                      )}
                    </button>
                  </div>
                </div>
                <div>{error.message}</div>
                <div className="row-container">
                  <div className="sec-update-button">
                    <button
                      type="submit"
                      className="button __vmc"
                      disabled={loading}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
              {success && (
                <div className="success-message">
                  Password updated successfully
                </div>
              )}
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
    </div>
  );
}

export default Security;
