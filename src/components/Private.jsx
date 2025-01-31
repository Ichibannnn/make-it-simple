import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Private = ({ Render }) => {
  const authenticate = useSelector((state) => state.auth);

  console.log("Authenticate: ", authenticate);

  // if (authenticate) {
  //   return <Render />;
  // }

  // return <Navigate to="/login" replace />;

  return authenticate ? <Render /> : <Navigate to="/login" />;
};

export default Private;
