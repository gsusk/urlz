import { Location, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  const location: Location<{ verified?: boolean }> = useLocation();
  return (
    <>
      <header className="heading">
        <Navbar></Navbar>
        {location.state && location.state.verified && (
          <div>
            Your account was verified successfully!
            <span></span>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
