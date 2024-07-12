import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { useEffect, useState } from "react";
import { formError, logout, verify } from "../redux/user/user";

function EmailVerification() {
  const location = useLocation();
  const [query] = useSearchParams();
  const isVerified = useAppSelector((state) => state.user.user?.isVerified);
  const [isSuccess, setIsSuccess] = useState(false);
  const message = useAppSelector((state) => state.user.error.message);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isVerified) {
      const token = query.get("etoken")?.trim();

      if (!token) {
        dispatch(formError({ message: "Invalid token." }));
        setLoading(false);
        return;
      }

      const verificationWrapper = async () => {
        try {
          await dispatch(verify(token)).unwrap();
          setIsSuccess(true);
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      };
      verificationWrapper();
    }

    return () => {
      if (isVerified && isSuccess) {
        dispatch(logout());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (isSuccess) {
    return (
      <Navigate to={"/login"} state={"Email verified succesfully!"}></Navigate>
    );
  }

  if (isVerified) {
    return <Navigate to={"/"}></Navigate>;
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>An Error ocurred at the verification proccess: </h2>
      <div>
        {message ?? "Unexpected Error, please try later or contact support."}
      </div>
    </div>
  );
}

export default EmailVerification;
