import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import AuthGuard from "./components/AuthGuard";

// Lazy load all pages for better performance
const Landing = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/LoginPage"));
const Register = lazy(() => import("./pages/RegisterPage"));
const GuidePublic = lazy(() => import("./pages/GuidePublicPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Library = lazy(() => import("./pages/LibraryPage"));
const FindWithAI = lazy(() => import("./pages/FindWithAI"));
const MaterialDetail = lazy(() => import("./pages/MaterialDetail"));
const PresentationMode = lazy(() => import("./pages/PresentationModePage"));
const Guide = lazy(() => import("./pages/GuidePage"));
const Profile = lazy(() => import("./pages/ProfilePage"));
const Pricing = lazy(() => import("./pages/PricingPage"));
const PricingPublic = lazy(() => import("./pages/PricingPublicPage"));
const Payment = lazy(() => import("./pages/PaymentPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("./pages/ResetPasswordPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMaterialsPage = lazy(() => import("./pages/admin/AdminMaterialsPage"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Loading spinner component
function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm animate-pulse">Đang tải...</p>
            </div>
        </div>
    );
}

// Helper to wrap lazy components with Suspense and ScrollToTop
function withSuspense(Component: React.LazyExoticComponent<any>) {
    return () => (
        <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <Component />
        </Suspense>
    );
}

// Helper with AuthGuard for protected pages
function withAuth(Component: React.LazyExoticComponent<any>) {
    return () => (
        <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <AuthGuard>
                <Component />
            </AuthGuard>
        </Suspense>
    );
}

export const router = createBrowserRouter([
    {
        path: "/",
        Component: withSuspense(Landing),
    },
    {
        path: "/login",
        Component: withSuspense(Login),
    },
    {
        path: "/register",
        Component: withSuspense(Register),
    },
    {
        path: "/forgot-password",
        Component: withSuspense(ForgotPassword),
    },
    {
        path: "/reset-password",
        Component: withSuspense(ResetPassword),
    },
    {
        path: "/guide",
        Component: withSuspense(GuidePublic),
    },
    {
        path: "/dashboard",
        Component: withAuth(Dashboard),
    },
    {
        path: "/library",
        Component: withAuth(Library),
    },
    {
        path: "/find-ai",
        Component: withAuth(FindWithAI),
    },
    {
        path: "/material/:id",
        Component: withAuth(MaterialDetail),
    },
    {
        path: "/presentation/:id",
        Component: withAuth(PresentationMode),
    },
    {
        path: "/guide-app",
        Component: withAuth(Guide),
    },
    {
        path: "/profile",
        Component: withAuth(Profile),
    },
    {
        path: "/pricing",
        Component: withSuspense(PricingPublic),
    },
    {
        path: "/pricing-app",
        Component: withAuth(Pricing),
    },
    {
        path: "/payment/:planId",
        Component: withAuth(Payment),
    },
    {
        path: "/admin/dashboard",
        Component: withAuth(AdminDashboard),
    },
    {
        path: "/admin/materials",
        Component: withAuth(AdminMaterialsPage),
    },
    {
        path: "/admin/users",
        Component: withAuth(AdminUsersPage),
    },
    {
        path: "*",
        Component: withSuspense(NotFound),
    },
]);
