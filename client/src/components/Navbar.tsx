import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/appSelector";
import MyImage from "./MyImage";

function Navbar() {
  const user = useAppSelector((state) => state.user.user);
  const handleClick = () => {};
  return (
    <div className="nav-container">
      <div className="img-c-fit">
        <img className="img-logo" src="/logosm.png" alt="logosmall" />
      </div>
      <div className="grow-end-c">
        {!user ? (
          <>
            <Link to="/register">
              <button className="button __vsc">Sign Up</button>
            </Link>
            <Link to="/login">
              <button className="button __vsc">Sign In</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/manager" className="manager-header-container">
              <button className="button __vsc">MANAGER</button>
            </Link>
            <div className="profile-header-container" onClick={handleClick}>
              <div className="pfp-image-header-container">
                <MyImage
                  src={`${user.profilePic}`}
                  alt="pic"
                  width="2.3rem"
                  height="2.3rem"
                />
              </div>
              <div className="username-header-container">
                <span className="username-header-display">Gsuskre123</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
