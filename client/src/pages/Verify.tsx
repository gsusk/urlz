import { Link, Navigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import "./Login.css";
import { useAppSelector } from "../hooks/appSelector";
import { getNewVerificationEmail } from "../services/auth";

function Verify() {
  const user = useAppSelector((state) => state.user.user);

  const handleClick = async (e: React.FormEvent<HTMLSpanElement>) => {
    e.preventDefault();
    try {
      const res = await getNewVerificationEmail();
    } catch (err) {
      ("");
    }
  };

  if (!user || user.isVerified) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }

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
          <div>
            <h2>A Verification request has been sent to {user.email}.</h2>
            <p>
              If you didnt received an email or need a new one click{" "}
              <span onClick={handleClick}>here</span>.
            </p>
          </div>
        </div>
        <div className="bmt"></div>
      </section>
    </>
  );
}

export default Verify;
