import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import * as t from "./Login.css";
console.log(t);
function Login() {
  return (
    <>
      <div className="modal"></div>
      <section className="lat-bar">
        <div className="lat-bar-icontainer">
          <div className="lb-i-cont">
            <img
              src="logomd.png"
              alt="mid logo"
              className="lb-img"
              loading="eager"
            />
          </div>
          <div>
            <p className="feat-text">Join us to access more features!</p>
          </div>
          <LoginForm />
          <div>
            <p className="feat-text">
              Don't have an account?
              <Link className="denote __c" to={"/register"}>
                <span>Sign Up</span>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
