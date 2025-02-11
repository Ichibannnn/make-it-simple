import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PermittedRoutes from "../app/PermittedRoutes";

const Private = ({ Render }) => {
  const fullname = useSelector((state) => state?.user?.fullname);
  const permissions = useSelector((state) => state?.user?.permissions);

  return !fullname || permissions?.length === 0 ? <Navigate to="/login" /> : <PermittedRoutes Render={Render} />;
};

export default Private;
