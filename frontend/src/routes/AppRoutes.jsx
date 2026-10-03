import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Dashboard from "../pages/dashboard/Dashboard";

import { useAuth } from "../context/AuthContext";
import HealthProfile from "../pages/patient/HealthProfile";
import EmergencyPassport from "../pages/emergency/EmergencyPassport";
import EmergencyQR from "../pages/emergency/EmergencyQR";
import EmergencyAccess from "../pages/emergency/EmergencyAccess";
import AIHealthSummary from "../pages/ai/AIHealthSummary";
import AIHealthInsights from "../pages/ai/AIHealthInsights";
import EmergencyRiskAnalysis from "../pages/ai/EmergencyRiskAnalysis";
import EmergencyGuidance from "../pages/ai/EmergencyGuidance";
import EmergencyAccessHistory
    from "../pages/emergency/EmergencyAccessHistory";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-svh items-center justify-center bg-slate-50">
                <p className="text-sm font-medium text-slate-600">
                    Loading your session...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/verify-otp"
                element={<VerifyOtp />}
            />

            {/* Protected Dashboard */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
            <Route
                path="/patient/profile"
                element={
                    <ProtectedRoute>
                        <HealthProfile />
                    </ProtectedRoute>
                }
            />
            {/* Unknown Route */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />
            <Route
                path="/emergency-passport"
                element={
                    <ProtectedRoute>
                        <EmergencyPassport />
                    </ProtectedRoute>
                }
            />
             <Route
                path="/emergency/qr"
                element={
                    <ProtectedRoute>
                        <EmergencyQR />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/emergency/access/:token"
                element={<EmergencyAccess />}
            />
            <Route
                path="/ai-health-summary"
                element={
                    <ProtectedRoute>
                        <AIHealthSummary />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ai/insights"
                element={
                    <ProtectedRoute>
                        <AIHealthInsights />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ai/emergency-risk"
                element={
                    <ProtectedRoute>
                        <EmergencyRiskAnalysis />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/ai/emergency-guidance"
                element={
                    <ProtectedRoute>
                        <EmergencyGuidance />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/emergency/history"
                element={
                    <ProtectedRoute>
                        <EmergencyAccessHistory />
                    </ProtectedRoute>
                }
            />

        </Routes>
        
    );
};

export default AppRoutes;
