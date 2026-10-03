import {
    ArrowRight,
    QrCode,
    Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const DashboardHero = ({ profile, loading }) => {

    const navigate = useNavigate();
    const { user } = useAuth();

    const firstName =
        user?.fullName?.trim().split(" ")[0] || "there";

    return (
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8">

            {/* Background decoration */}
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

                {/* Left Content */}
                <div>

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5">

                        <Sparkles className="h-4 w-4 text-blue-300" />

                        <span className="text-xs font-medium text-blue-100">
                            Emergency Health Information
                        </span>

                    </div>

                    <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">

                        Welcome back, {firstName}

                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">

                        Your Emergency Health Passport keeps your
                        critical medical information ready for secure
                        access when every second matters.

                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/emergency/qr")
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                        >

                            <QrCode className="h-5 w-5" />

                            Open Emergency QR

                            <ArrowRight className="h-4 w-4" />

                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/ai/insights")
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                        >

                            <Sparkles className="h-5 w-5 text-purple-300" />

                            AI Health Insights

                        </button>

                    </div>

                </div>

                {/* Profile status */}
                <div className="min-w-[250px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">

                    <div className="flex items-start justify-between gap-4">

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Health Profile Status
                            </p>

                            <div className="mt-3 flex items-center gap-2">

                                <span className={`h-2.5 w-2.5 rounded-full ${
                                    profile
                                        ? "bg-emerald-400"
                                        : "bg-amber-400"
                                }`} />

                                <span className="font-bold text-slate-100">
                                    {loading
                                        ? "CHECKING PROFILE"
                                        : profile
                                            ? "PROFILE SAVED"
                                            : "PROFILE NEEDED"}
                                </span>

                            </div>

                        </div>

                    </div>

                    <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-slate-400">

                        {profile
                            ? "Review your emergency details and generate or refresh your QR when needed."
                            : "Complete your health profile before generating an emergency QR code."}

                    </p>

                </div>

            </div>

        </section>
    );
};

export default DashboardHero;
