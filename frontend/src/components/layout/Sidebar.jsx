import {
    LayoutDashboard,
    HeartPulse,
    QrCode,
    Sparkles,
    History,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const navItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Health Profile",
        path: "/patient/profile",
        icon: HeartPulse,
    },
    {
        label: "Emergency QR",
        path: "/emergency/qr",
        icon: QrCode,
    },
    {
        label: "AI Health Insights",
        path: "/ai/insights",
        icon: Sparkles,
    },
    {
        label: "Access History",
        path: "/emergency/history",
        icon: History,
    },
];

const formatRole = (role) => {
    if (!role) {
        return "Patient";
    }

    return role
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

const Sidebar = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user?.fullName
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully.");
        navigate("/login");
    };

    return (
        <div className="flex h-full flex-col bg-slate-800 text-slate-100">
            <div className="flex items-center gap-3 px-5 py-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
                    <HeartPulse className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-sm font-semibold tracking-tight text-white">
                        MedPass AI
                    </p>
                    <p className="text-xs text-slate-400">
                        Emergency Health Passport
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-teal-700 text-white"
                                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                }`
                            }
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-700 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                        {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                            {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-slate-400">
                            {formatRole(user?.role)}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-red-300"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
