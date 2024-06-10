import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { signUp } from "../redux/user/user";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

function RegisterForm() {
  const loading = useAppSelector((state) => state.user.loading);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [inputType, setInputType] = useState("password");
  const dispatch = useAppDispatch();
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const id = e.currentTarget.id;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(signUp(formData));
  };

  if (loading) {
    return <div>Loading</div>;
  }

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
          <div className="password-cover-wrapper">
            <input
              type={inputType}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-form-input"
              ref={passwordRef}
              autoComplete="new-password"
              required
            />
            {inputType === "text" ? (
              <FaRegEyeSlash
                className="password-cover-icon"
                onClick={() => setInputType("password")}
              />
            ) : (
              <FaRegEye
                className="password-cover-icon"
                onClick={() => setInputType("text")}
              />
            )}
          </div>
          <label htmlFor="confirmPassword" className="login-form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="login-form-input"
            autoComplete="new-password"
            required
          />
          <div>
            <p className="feat-text">
              Already have an account?
              <Link className="denote __c" to={"/login"}>
                <span>Sign In</span>
              </Link>
            </p>
          </div>
          <div className="sign-form-cont">
            <button className="sign-form-button button __vmc">Sign Up</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterForm;
