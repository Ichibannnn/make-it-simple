import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRedirect = ({ children }) => {
  const fullname = useSelector((state) => state?.user?.fullname);
  const permissions = useSelector((state) => state?.user?.permissions);

  if (fullname && permissions?.length > 0) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRedirect;
