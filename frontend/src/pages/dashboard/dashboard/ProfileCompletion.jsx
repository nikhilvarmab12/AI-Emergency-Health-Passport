import { ArrowRight, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const profileFields = [
    ["Blood group", "bloodGroup"],
    ["Allergies", "allergies"],
    ["Chronic conditions", "chronicDiseases"],
    ["Current medications", "currentMedications"],
    ["Emergency contact", "emergencyContactName"],
    ["Emergency contact phone", "emergencyContactPhone"],
];

const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== "";

const ProfileCompletion = ({ profile, loading, error }) => {
    const navigate = useNavigate();
    const completed = profile
        ? profileFields.filter(([, field]) => hasValue(profile[field])).length
        : 0;
    const percentage = Math.round((completed / profileFields.length) * 100);
    const missing = profile
        ? profileFields
            .filter(([, field]) => !hasValue(profile[field]))
            .map(([label]) => label)
        : [];

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">Emergency profile details</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Keep critical information available for emergency care.
                        </p>
                    </div>
                </div>
                {!loading && profile && (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800">
                        {percentage}% recorded
                    </span>
                )}
            </div>

            {loading ? (
                <p className="mt-6 text-sm text-slate-500">Loading profile status...</p>
            ) : error ? (
                <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>
            ) : !profile ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <p className="font-medium text-slate-800">Your health profile has not been created.</p>
                    <p className="mt-1 text-sm text-slate-600">Add your emergency medical information before creating a QR code.</p>
                </div>
            ) : (
                <div className="mt-6">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-teal-600" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                        {missing.length === 0
                            ? "Your key emergency details are recorded. Review them whenever your health information changes."
                            : `Still to review: ${missing.join(", ")}.`}
                    </p>
                </div>
            )}

            <button
                type="button"
                onClick={() => navigate("/patient/profile")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-950"
            >
                {profile ? "Review health profile" : "Complete health profile"}
                <ArrowRight className="h-4 w-4" />
            </button>
        </section>
    );
};

export default ProfileCompletion;
