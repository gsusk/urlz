import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/appSelector";
import { useEffect, useState } from "react";
import { formError, logout, verify } from "../redux/user/user";

function EmailVerification() {
  const location = useLocation();
  const [query] = useSearchParams();
  const isVerified = useAppSelector((state) => state.user.user?.isVerified);
  const message = useAppSelector((state) => state.user.error.message);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = query.get("etoken")?.trim();

    const verificationWrapper = async () => {
      try {
        await dispatch(verify(token as string)).unwrap();
        dispatch(logout());
        navigate("/login", {
          state: "Succesfully verified",
          replace: true,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!isVerified) {
      if (!token) {
        dispatch(formError({ message: "Invalid token." }));
        setLoading(false);
      } else {
        verificationWrapper();
      }
    } else {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isVerified]);

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
