import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user);

  // If there is no user in Redux, redirect to login!
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the child component (or Outlet if used as layout)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
