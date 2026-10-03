import { ArrowRight, History } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => value ? new Date(value).toLocaleString() : "Time unavailable";

const RecentActivity = ({ history, loading, error }) => {
    const navigate = useNavigate();
    const recentEntries = history.slice(0, 3);

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <History className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">Recent emergency access</h2>
                        <p className="mt-1 text-sm text-slate-500">Recent passport access recorded for your account.</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/emergency/history")}
                    className="hidden text-sm font-semibold text-teal-800 hover:text-teal-950 sm:inline-flex sm:items-center sm:gap-1"
                >
                    View all <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-slate-500">Loading access history...</p>
            ) : error ? (
                <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>
            ) : recentEntries.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <p className="font-medium text-slate-800">No emergency access has been recorded yet.</p>
                    <p className="mt-1 text-sm text-slate-600">Access records will appear here when a valid public QR link is opened.</p>
                </div>
            ) : (
                <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {recentEntries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3">
                            <div>
                                <p className="text-sm font-medium text-slate-800">
                                    {entry.accessType === "PASSPORT_VIEWED" ? "Emergency passport viewed" : entry.accessType}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">{formatDate(entry.accessedAt)}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                entry.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                            }`}>
                                {entry.success ? "Recorded" : "Unsuccessful"}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={() => navigate("/emergency/history")}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-950 sm:hidden"
            >
                View access history <ArrowRight className="h-4 w-4" />
            </button>
        </section>
    );
};

export default RecentActivity;
