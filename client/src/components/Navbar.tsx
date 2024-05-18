import { useState } from "react";

function Navbar() {
  const [show, setShow] = useState(false);

  const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {};

  return (
    <div className="nav-container">
      <div className="img-c-fit">
        <img src="/logosm.png" alt="logosmall" />
      </div>
      <div className="grow-end-c">
        <button className="button __vsc" onClick={handleClick}>
          Sign Up
        </button>
        <button className="button __vsc" onClick={handleClick}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Navbar;
