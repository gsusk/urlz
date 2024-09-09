import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/appSelector";

function Guest() {
  const isAuth = useAppSelector((state) => state.user.isAuthenticated);

  if (isAuth) {
    return <Navigate to={"/"}></Navigate>;
  }

  return <Outlet />;
}

export default Guest;
