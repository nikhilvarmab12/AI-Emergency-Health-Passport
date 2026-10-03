import {
    Bell,
    Menu,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Topbar = ({ title, onMenuClick }) => {
    const { user } = useAuth();

    const initials = user?.fullName
        ?.split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    const roleLabel = user?.role
        ? user.role
            .toLowerCase()
            .split("_")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : "Patient";

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 md:px-6">
            <button
                type="button"
                onClick={onMenuClick}
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                aria-label="Open navigation"
            >
                <Menu className="h-5 w-5" />
            </button>

            <h1 className="truncate text-base font-semibold text-slate-900 md:text-lg">
                {title}
            </h1>

            <div className="ml-auto flex items-center gap-3">
                <button
                    type="button"
                    className="relative rounded-md p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-700 text-xs font-semibold text-white">
                        {initials}
                    </div>

                    <div className="hidden leading-tight md:block">
                        <p className="text-sm font-medium text-slate-800">
                            {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-slate-500">
                            {roleLabel}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
