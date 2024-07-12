import { Link, Location, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { GrClose } from "react-icons/gr";
import "./Login.css";
import { useEffect, useState } from "react";
import { string } from "zod";

function Login() {
  const location: Location<string | undefined> = useLocation();
  const [locationState, setLocationState] = useState<string | undefined>(
    location.state
  );

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
        {locationState && (
          <div className="info-pop-up">
            {locationState}
            <span
              className="info-pop-up-close"
              onClick={() => setLocationState(undefined)}
            >
              <GrClose></GrClose>
            </span>
          </div>
        )}
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
