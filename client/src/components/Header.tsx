import { Location, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Header() {
  const location: Location<{ verified?: boolean }> = useLocation();
  location.state = { verified: true };
  return (
    <>
      <header className="heading">
        <Navbar></Navbar>
        {location.state && location.state.verified && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 1,
              backgroundColor: "green",
              opacity: 0.6,
              color: "var(--main-darkest-color)",
            }}
          >
            Your account was verified successfully!
            <span></span>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
