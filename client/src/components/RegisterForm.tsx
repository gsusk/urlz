import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { formError, resetError, signUp } from "../redux/user/user";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { type RegisterForm } from "../services/auth";
import { z } from "zod";
import { serializeZodError } from "../utils/errorparser";

const registerFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, { message: "Must be at least 4 characters long" })
      .max(64, { message: "Too many characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Not valid email" })
      .min(5, { message: "Must be at least 5 characters long" })
      .max(64, { message: "Too many characters" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Must be at least 8 characters long" }),
    confirmPassword: z.string().trim(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords doesnt match",
        path: ["confirmPassword"],
      });
    }
  });

function RegisterForm() {
  const loading = useAppSelector((state) => state.user.loading);
  const username = useAppSelector((state) => state.user.error.username);
  const email = useAppSelector((state) => state.user.error.email);
  const password = useAppSelector((state) => state.user.error.password);
  const confirmPassword = useAppSelector(
    (state) => state.user.error.confirmPassword
  );
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [inputType, setInputType] = useState("password");
  const dispatch = useAppDispatch();
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    dispatch(resetError());
    const value = e.currentTarget.value;
    const id = e.currentTarget.id;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = registerFormSchema.safeParse(formData);

    if (result.success) {
      await dispatch(signUp(result.data));
    } else {
      const errors = serializeZodError<typeof formData>(result.error);
      dispatch(formError(errors));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

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
            className={`login-form-input ${username && "__err"}`}
            required
          />
          <div className="shortener-err-div">{username}</div>
          <label htmlFor="email" className="login-form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
            className={`login-form-input ${email && "__err"}`}
            required
          />
          <div className="shortener-err-div">{email}</div>
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
              className={`login-form-input ${password && "__err"}`}
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
          <div className="shortener-err-div">{password}</div>
          <label htmlFor="confirmPassword" className="login-form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`login-form-input ${confirmPassword && "__err"}`}
            autoComplete="new-password"
            required
          />
          <div className="shortener-err-div">{confirmPassword}</div>
          <div>
            <p className="feat-text">
              Already have an account?
              <Link className="denote __c" to={"/login"}>
                <span>Sign In</span>
              </Link>
            </p>
          </div>
          <div className="sign-form-cont">
            <button
              disabled={loading}
              className="sign-form-button button __vmc"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterForm;
