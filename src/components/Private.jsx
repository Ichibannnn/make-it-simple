import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Private = ({ Render }) => {
  const authenticate = useSelector((state) => state.auth);

  if (authenticate) {
    return <Render />;
  }

  return <Navigate to="/" replace />;
};

export default Private;
