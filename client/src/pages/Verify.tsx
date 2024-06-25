import { Link, Navigate, useSearchParams } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import "./Login.css";
import { useAppSelector } from "../hooks/appSelector";
import { useEffect, useState } from "react";

function Verify() {
  const [query] = useSearchParams();
  const isVerified = useAppSelector((state) => state.user.user?.isVerified);
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("triggerrrrrs....");
    if (!loading) setLoading(true);
    const verifyAccount = async () => {
      try {
        await  
      } catch (err) {

      }
    }
  }, []);

  if (!query.get("etoken") || isVerified) {
    return <Navigate to={"/register"}></Navigate>;
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
          {loading ? (
            <div>Loading...</div>
          ) : Object.values(error).length > 0 ? (
            <div>
              <h2>An error ocurred verifying your account:</h2>
              <p>{error.message ?? "Unexpected Error"}</p>
              <p>
                Please try later or{" "}
                <span>
                  <b>send a verification email.</b>
                </span>
              </p>
            </div>
          ) : (
            <div>
              <h2>Your verification is complete!</h2>
              <p>Now you can access all the features you couldnt before!</p>
              <Link to={"/"}>Start</Link>
            </div>
          )}
          <div className="bmt"></div>
        </div>
      </section>
    </>
  );
}

export default Verify;
