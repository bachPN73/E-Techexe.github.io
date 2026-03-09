import { Navigate } from "react-router";

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const user = localStorage.getItem("edu_tech_user");

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
