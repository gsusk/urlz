import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/appSelector";
import MyImage from "./MyImage";

function Navbar() {
  const username = useAppSelector((state) => state.user.user?.username);
  const profilePic = useAppSelector((state) => state.user.user?.profilePic);

  const handleClick = () => {};
  return (
    <div className="nav-container">
      <div className="img-c-fit">
        <img
          src="/logosm.png"
          alt="logosmall"
          fetchPriority="high"
          height="100%"
          className="img-logo"
        />
      </div>
      <div className="grow-end-c">
        {!username ? (
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
            <Link to="/my-urls" className="manager-header-container">
              <button className="button __vsc">MANAGER</button>
            </Link>
            <Link
              to="/settings/profile"
              className="profile-header-container"
              onClick={handleClick}
            >
              <div className="pfp-image-header-container">
                <MyImage src={profilePic!} alt="pic" fetchPriority="high" />
              </div>
              <div className="username-header-container">
                <span className="username-header-display">{username}</span>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
