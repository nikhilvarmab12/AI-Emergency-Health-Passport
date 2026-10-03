import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({ title, children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-svh bg-slate-50 text-slate-900">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 lg:block">
                <Sidebar />
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-slate-900/40"
                        onClick={() => setMobileOpen(false)}
                    />

                    <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-slate-200 shadow-xl">
                        <Sidebar onNavigate={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            <div className="lg:pl-64">
                <Topbar
                    title={title}
                    onMenuClick={() => setMobileOpen(true)}
                />

                <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
                    {children}
                </main> 
            </div>
        </div>
    );
};

export default AppLayout;
