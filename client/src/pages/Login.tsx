import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { GrClose } from "react-icons/gr";
import "./Login.css";

function Login() {
  return (
    <>
      <Link to={"/"} className="modal"></Link>
      <section className="lat-bar">
        <div className="form-top-sep">
          <Link to={"/"} className="close-form-button">
            <button className="button __vsc log-b-f">
              <GrClose className="GrClose" />
            </button>
          </Link>
        </div>
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
        </div>
      </section>
    </>
  );
}

export default Login;
