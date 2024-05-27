import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [show, setShow] = useState(false);

  return (
    <div className="nav-container">
      <div className="img-c-fit">
        <img src="/logosm.png" alt="logosmall" />
      </div>
      <div className="grow-end-c">
        <Link to="/login">
          <button className="button __vsc">Sign Up</button>
        </Link>
        <Link to="/register">
          <button className="button __vsc">Sign In</button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
