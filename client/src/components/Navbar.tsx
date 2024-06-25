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
        {!user && (
          <Link to="/register">
            <button className="button __vsc">Sign Up</button>
          </Link>
        )}
        {!user && (
          <Link to="/login">
            <button className="button __vsc">Sign In</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
