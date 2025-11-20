import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const ProtectedRoute = () => {
    const { auth, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="p-4">Loading...</div>;

    return auth ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default ProtectedRoute;