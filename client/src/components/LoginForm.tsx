import { useState } from "react";
import { Link } from "react-router-dom";
import { signIn } from "../redux/user/user";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { z } from "zod";
import { type LoginForm } from "../services/auth";

const formLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(64, { message: "Too many characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Must be at least 8 characters long" }),
});

function LoginForm() {
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  const [inputType, setInputType] = useState("password");
  const loading = useAppSelector((state) => state.user.loading);
  const error = useAppSelector((state) => state.user.error);
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
    if (Object.keys(formErrors).length > 0) return;

    const result = formLoginSchema.safeParse(formData);
    if (result.success) {
      await dispatch(signIn(result.data));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
