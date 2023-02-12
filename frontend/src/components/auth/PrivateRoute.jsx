import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "../../context";

const PrivateRoute = () => {
	const { user } = useAuthState();
	const location = useLocation();

	return user ? <Outlet /> : <Navigate to={"/"} state={{ from: location }} replace />;
};

export default PrivateRoute;
