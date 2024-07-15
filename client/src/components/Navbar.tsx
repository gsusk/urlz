import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/appSelector";

function Navbar() {
  const user = useAppSelector((state) => state.user.user);
  return (
    <div className="nav-container">
      <div className="img-c-fit">
        <img src="/logosm.png" alt="logosmall" />
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
            <Link to="/manager">
              <button className="button __vsc">MANAGER</button>
            </Link>
            <Link to="/profile">
              <button className="button __vsc __sm">PROFILE</button>
            </Link>
            <div>
              <img src={`${user.email}`} alt="" className="pfp-image-header" />
              <span>{user.username}</span>
            </div>
          </>
        )}{" "}
      </div>
    </div>
  );
}

export default Navbar;
