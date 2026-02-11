// src/utilities/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './auth';
import { JSX } from "react";

interface PrivateRouteProps {
    children: JSX.Element;
    allowedRoles?: string[]; // Optional prop
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
    const authenticated = isAuthenticated();
    const role = getUserRole(); // e.g., 'admin', 'chef', 'user'

    if (!authenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(role || '')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;
