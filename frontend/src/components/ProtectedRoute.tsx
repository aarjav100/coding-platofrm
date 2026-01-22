import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const location = useLocation();
    const userInfoString = localStorage.getItem('userInfo');
    const user = userInfoString ? JSON.parse(userInfoString) : null;

    if (!user) {
        // Redirect to auth page but save the location they were trying to go to
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role || 'user')) {
        // User is logged in but doesn't have permission
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
