import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { formError, resetError, signUp } from "../redux/user/user";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import { serializeZodError } from "../utils/errorparser";
import { registerFormSchema, type RegisterType } from "../validation/forms";

function RegisterForm() {
  const loading = useAppSelector((state) => state.user.loading);
  const username = useAppSelector((state) => state.user.error?.username);
  const email = useAppSelector((state) => state.user.error?.email);
  const password = useAppSelector((state) => state.user.error?.password);
  const message = useAppSelector((state) => state.user.error.message);
  const confirmPassword = useAppSelector(
    (state) => state.user.error?.confirmPassword
  );
  const passwordRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<RegisterType>({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [inputType, setInputType] = useState("password");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (username || email || password || message || confirmPassword)
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
      try {
        await dispatch(signUp(result.data)).unwrap();
        return navigate("/email/verify");
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(result);
      const errors = serializeZodError<RegisterType>(result.error);
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
          <div className="shortener-err-div">
            {message &&
              !username &&
              !email &&
              !password &&
              !confirmPassword &&
              `Error: ${message?.toLocaleUpperCase()}`}
          </div>
        </form>
      </div>
    </>
  );
}

export default RegisterForm;
