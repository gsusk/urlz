import { Link, Navigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import "./Login.css";
import { useAppSelector } from "../hooks/appSelector";
import { getNewVerificationEmail } from "../services/auth";
import { useState } from "react";
import { errorHandler } from "../utils/errorparser";

function Verify() {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [error, setError] = useState("");

  const handleClick = async (e: React.FormEvent<HTMLSpanElement>) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await getNewVerificationEmail();
      setIsSuccessful(true);
    } catch (err) {
      setError(errorHandler(err as Error).message);
    } finally {
      setLoading(false);
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
            <h4>Verify your email address</h4>
          </div>
          {!isSuccessful && !loading && !error && (
            <div>
              <h2>
                A verification request has been sent to your email address.
              </h2>
              <p>
                If you didn't receive an email or need a new one, click{" "}
                <span onClick={handleClick}>here</span>.
              </p>
            </div>
          )}
          {loading && <div>Loading...</div>}
          {error && error.trim().length > 0 && (
            <div>
              <h2>An error occurred during the request process.</h2>
              <p>More info: {error}</p>
              <p>
                Try again <span onClick={handleClick}>here</span> or contact
                with support.
              </p>
            </div>
          )}
          {isSuccessful && !loading && !error && (
            <div>
              <h2>
                A new verification request has been sent to your email address.
              </h2>
              <p>
                If you didn't receive an email or need a new one, click{" "}
                <span onClick={handleClick}>here</span>.
              </p>
            </div>
          )}
        </div>
        <div className="bmt"></div>
      </section>
    </>
  );
}

export default Verify;
