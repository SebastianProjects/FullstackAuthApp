import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { authState } = useAuth();
    const location = useLocation();

    return (
        authState?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : authState?.email
                ? <Navigate to='/unauthorized' state={{ from: location }} replace />
                : <Navigate to='/login' state={{ from: location }} replace />
    );
}

export default RequireAuth;