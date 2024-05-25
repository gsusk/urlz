import { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const id = e.currentTarget.id;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="bmt">
        <form onSubmit={handleSubmit}>
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
          />
          <div>
            <p className="feat-text">
              Don't have an account?
              <Link className="denote __c" to={"/register"}>
                <span>Sign Up</span>
              </Link>
            </p>
          </div>
          <div className="sign-form-cont">
            <button className="sign-form-button button __vmc">Login</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
