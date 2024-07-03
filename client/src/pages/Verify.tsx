import { Link, Navigate, useSearchParams } from "react-router-dom";
import { GrClose } from "react-icons/gr";
import "./Login.css";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { useEffect, useState } from "react";
import { verifyAccount } from "../services/auth";
import { successfulVerification } from "../redux/user/user";

function Verify() {
  const [query] = useSearchParams();
  const isVerified = useAppSelector((state) => state.user.user?.isVerified);
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loading) setLoading(true);
    const verify = async () => {
      try {
        const res = await verifyAccount(query.get("etoken") as string);
        if ("errors" in res) {
          return setError({ meesage: res.message });
        }
        dispatch(successfulVerification());
      } catch (err) {
        if (err instanceof Error && "message" in err) {
          setError({ message: err.message });
        } else {
          setError({ message: "Unexpected Error, try later." });
        }
      } finally {
        setLoading(false);
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!query.get("etoken") || isVerified) {
    return (
      <Navigate to={"/register"} state={{ verification: "success" }}></Navigate>
    );
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
          {loading && <div>Loading...</div>}{" "}
          {Object.values(error).length > 0 && (
            <div>
              <h2>An error ocurred verifying your account:</h2>
              <p>{error.message ?? "Unexpected Error"}</p>
              <p>
                Please try later or
                <span>
                  <b> send a new verification code.</b>
                </span>
              </p>
            </div>
          )}
          <div className="bmt"></div>
        </div>
      </section>
    </>
  );
}

export default Verify;
