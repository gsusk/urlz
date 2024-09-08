import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resetError, signIn } from "../redux/user/user";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { formError } from "../redux/user/user";
import { serializeZodError } from "../utils/errorparser";
import { loginFormSchema, type LoginType } from "../validation/forms";

function LoginForm() {
  const [formData, setFormData] = useState<LoginType>({
    username: "",
    password: "",
  });
  const [inputType, setInputType] = useState("password");
  const loading = useAppSelector((state) => state.user.loading);
  const username = useAppSelector((state) => state.user.error?.username);
  const password = useAppSelector((state) => state.user.error?.password);
  const message = useAppSelector((state) => state.user.error?.message);
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
    const result = loginFormSchema.safeParse(formData);

    if (result.success) {
      await dispatch(signIn(result.data));
    } else {
      const errors = serializeZodError<typeof formData>(result.error);
      dispatch(formError({ message: "", ...errors }));
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
          <div className="shortener-err-div scroller">{username}</div>
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
          <div className="shortener-err-div scroller">{password}</div>
          <div>
            <p className="feat-text">
              Don't have an account?
              <Link className="denote __c" to={"/register"}>
                <span>Sign Up</span>
              </Link>
            </p>
          </div>
          <div className="sign-form-cont">
            <button
              className="sign-form-button button __vmc"
              disabled={loading}
            >
              Login
            </button>
          </div>
          <div className="shortener-err-div">
            {message &&
              !username &&
              !password &&
              `Error: ${message?.toLocaleUpperCase()}`}
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
