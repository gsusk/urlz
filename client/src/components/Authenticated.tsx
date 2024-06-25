import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/appSelector";

function Authenticated() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to={"/"}></Navigate>;
  }

  return <Outlet />;
}

export default Authenticated;
