import { ArrowRight, QrCode, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyReadiness = ({ profile, loading, error }) => {
    const navigate = useNavigate();
    const readyForQr = Boolean(profile) && !error;

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    readyForQr ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                    {readyForQr ? <QrCode className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
                </div>
                <div>
                    <h2 className="font-semibold text-slate-900">Emergency QR access</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        A QR code provides a shareable public emergency-access link.
                    </p>
                </div>
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-slate-500">Checking emergency profile readiness...</p>
            ) : error ? (
                <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Profile status is unavailable. Review your profile before generating a QR.</p>
            ) : readyForQr ? (
                <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="font-medium text-emerald-950">Your emergency details are saved.</p>
                    <p className="mt-1 text-sm text-emerald-800">Generate or refresh your QR code when you need a current public emergency link.</p>
                </div>
            ) : (
                <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <p className="font-medium text-amber-950">Complete your health profile first.</p>
                    <p className="mt-1 text-sm text-amber-800">QR generation requires a saved patient health profile.</p>
                </div>
            )}

            <button
                type="button"
                onClick={() => navigate(readyForQr ? "/emergency/qr" : "/patient/profile")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-950"
            >
                {readyForQr ? "Open Emergency QR" : "Complete health profile"}
                <ArrowRight className="h-4 w-4" />
            </button>
        </section>
    );
};

export default EmergencyReadiness;
