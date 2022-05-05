import { useLocation, Navigate } from "react-router-dom";
import { useUser } from './';

export default function ProtectedRoute ({role = null, children}) {
    const { user, setLastLocation } = useUser();
    const location = useLocation();
    setLastLocation(location.pathname);

    let hasPermission = false;
    if (
        user !== null && 
        (role === null || role.indexOf(user.role) != -1)
    ) hasPermission = true;

    return hasPermission ? children : <Navigate to="/login" replace />;
}