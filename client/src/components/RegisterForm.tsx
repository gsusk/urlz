import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const id = e.currentTarget.id;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      <div className="bmt">
        <form>
          <label htmlFor="username" className="login-form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="login-form-input"
            required
          />
          <label htmlFor="email" className="login-form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            className="login-form-input"
            required
          />
          <label htmlFor="password" className="login-form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="login-form-input"
            required
          />
          <div>
            <p className="feat-text">
              ALready have an account?
              <Link className="denote __c" to={"/login"}>
                <span>Sign In</span>
              </Link>
            </p>
          </div>
          <div className="sign-form-cont">
            <button className="sign-form-button button __vmc">Register</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterForm;
