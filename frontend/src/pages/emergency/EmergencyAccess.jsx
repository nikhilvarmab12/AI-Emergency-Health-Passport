import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import emergencyService from "../../services/emergencyService";

const EmergencyAccess = () => {

    const { token } = useParams();

    const [passport, setPassport] = useState(null);
    const [guidance, setGuidance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [guidanceLoading, setGuidanceLoading] = useState(true);
    const [error, setError] = useState("");
    const [guidanceError, setGuidanceError] = useState("");

    useEffect(() => {

        const fetchEmergencyData = async () => {

            try {

                setLoading(true);
                setGuidanceLoading(true);

                const [passportResult, guidanceResult] =
                    await Promise.allSettled([
                        emergencyService.getEmergencyAccess(token),
                        emergencyService.getEmergencyGuidance(token),
                    ]);

                if (passportResult.status === "fulfilled") {
                    setPassport(passportResult.value);
                } else {

                    const message =
                        passportResult.reason?.response?.data?.message ||
                        "Unable to access Emergency Health Passport.";

                    setError(message);
                    toast.error(message);
                }

                if (guidanceResult.status === "fulfilled") {
                    setGuidance(guidanceResult.value);
                } else {

                    const message =
                        guidanceResult.reason?.response?.data?.message ||
                        "AI emergency guidance is currently unavailable.";

                    setGuidanceError(message);
                }

            } finally {

                setLoading(false);
                setGuidanceLoading(false);

            }
        };

        if (token) {
            fetchEmergencyData();
        }

    }, [token]);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg font-medium">
                    Loading Emergency Health Passport...
                </p>
            </div>
        );
    }

    if (error || !passport) {

        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">

                <div className="text-center max-w-md">

                    <div className="text-5xl mb-4">⚠️</div>

                    <h1 className="text-3xl font-bold mb-3">
                        Emergency Passport Unavailable
                    </h1>

                    <p className="text-gray-600">
                        {error || "Invalid or inactive emergency access token."}
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Emergency Header */}
            <header className="bg-red-600 text-white">

                <div className="max-w-6xl mx-auto px-4 md:px-6 py-5">

                    <p className="text-sm font-semibold uppercase tracking-wider text-red-100">
                        Emergency Medical Information
                    </p>

                    <h1 className="text-2xl md:text-3xl font-bold mt-1">
                        🚨 Emergency Health Passport
                    </h1>

                    <p className="text-red-100 mt-2">
                        Critical patient information for emergency medical care
                    </p>

                </div>

            </header>

            <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">

                {/* Patient Information */}
                <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                    <div className="p-6 border-b">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Patient
                                </p>

                                <h2 className="text-2xl font-bold">
                                    {passport.patientName}
                                </h2>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3">

                                <p className="text-xs text-red-600 font-medium">
                                    BLOOD GROUP
                                </p>

                                <p className="text-2xl font-bold text-red-700">
                                    {passport.bloodGroup || "Not available"}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">

                        <MedicalItem
                            title="Allergies"
                            value={passport.allergies}
                            important
                        />

                        <MedicalItem
                            title="Chronic Diseases"
                            value={passport.chronicDiseases}
                        />

                        <MedicalItem
                            title="Current Medications"
                            value={passport.currentMedications}
                        />

                        <MedicalItem
                            title="Previous Surgeries"
                            value={passport.previousSurgeries}
                        />

                        <MedicalItem
                            title="Emergency Contact"
                            value={
                                passport.emergencyContactName
                                    ? `${passport.emergencyContactName} (${passport.emergencyContactRelation || "Relation not specified"})`
                                    : null
                            }
                        />

                        <MedicalItem
                            title="Emergency Contact Phone"
                            value={passport.emergencyContactPhone}
                        />

                    </div>

                    <div className="px-6 pb-6">

                        <div className="bg-gray-50 border rounded-xl p-5">

                            <h3 className="font-semibold mb-2">
                                Medical Notes
                            </h3>

                            <p className="text-gray-700">
                                {passport.medicalNotes ||
                                    "No medical notes available."}
                            </p>

                        </div>

                    </div>

                </section>

                {/* AI Emergency Guidance */}
                <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                    <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                AI Decision Support
                            </p>

                            <h2 className="text-2xl font-bold mt-1">
                                AI Emergency Guidance
                            </h2>

                            <p className="text-gray-500 mt-2">
                                AI-assisted precautions and emergency care guidance
                            </p>

                        </div>

                        {guidance && (
                            <PriorityBadge
                                priority={guidance.emergencyPriority}
                            />
                        )}

                    </div>

                    <div className="p-6">

                        {guidanceLoading && (
                            <p className="text-gray-500">
                                Generating AI emergency guidance...
                            </p>
                        )}

                        {!guidanceLoading && guidanceError && (
                            <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-5">

                                <h3 className="font-semibold">
                                    AI Guidance Temporarily Unavailable
                                </h3>

                                <p className="text-gray-700 mt-1">
                                    {guidanceError}
                                </p>

                            </div>
                        )}

                        {!guidanceLoading && guidance && (
                            <div className="space-y-6">

                                {/* Overall Guidance */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                                    <h3 className="font-semibold mb-2">
                                        Emergency Overview
                                    </h3>

                                    <p className="text-gray-700 leading-7">
                                        {guidance.overallGuidance}
                                    </p>

                                </div>

                                {/* Immediate Precautions */}
                                <GuidanceList
                                    title="🚨 Immediate Precautions"
                                    items={guidance.immediatePrecautions}
                                    emptyMessage="No immediate precautions identified."
                                    numbered
                                />

                                {/* Warning Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                    <GuidanceList
                                        title="⚠️ Allergy Warnings"
                                        items={guidance.allergyWarnings}
                                        emptyMessage="No recorded allergy warnings."
                                    />

                                    <GuidanceList
                                        title="🩺 Condition Considerations"
                                        items={guidance.conditionConsiderations}
                                        emptyMessage="No condition considerations available."
                                    />

                                    <GuidanceList
                                        title="💊 Medication Warnings"
                                        items={guidance.medicationWarnings}
                                        emptyMessage="No medication warnings available."
                                    />

                                    <GuidanceList
                                        title="🩸 Blood Group Precautions"
                                        items={guidance.bloodGroupPrecautions}
                                        emptyMessage="No blood group precautions available."
                                    />

                                </div>

                                {/* Priority Actions */}
                                <GuidanceList
                                    title="📋 Priority Actions"
                                    items={guidance.priorityActions}
                                    emptyMessage="No priority actions available."
                                    numbered
                                />

                                {/* Disclaimer */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">

                                    <h3 className="font-semibold mb-2">
                                        Important Medical Disclaimer
                                    </h3>

                                    <p className="text-sm text-gray-700 leading-6">
                                        {guidance.disclaimer}
                                    </p>

                                </div>

                            </div>
                        )}

                    </div>

                </section>

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 py-4">

                    This Emergency Health Passport is intended to support
                    emergency medical decision-making. Healthcare professionals
                    must independently verify patient information before treatment.

                </footer>

            </main>

        </div>
    );
};


const MedicalItem = ({ title, value, important = false }) => {

    return (
        <div
            className={`rounded-xl border p-4 ${
                important
                    ? "bg-red-50 border-red-100"
                    : "bg-gray-50"
            }`}
        >

            <p className="text-sm text-gray-500 mb-1">
                {title}
            </p>

            <p
                className={`font-semibold ${
                    important ? "text-red-700" : "text-gray-900"
                }`}
            >
                {value || "Not available"}
            </p>

        </div>
    );
};


const PriorityBadge = ({ priority }) => {

    const styles = {

        HIGH: "bg-red-100 text-red-700 border-red-200",

        MODERATE:
            "bg-yellow-100 text-yellow-700 border-yellow-200",

        LOW:
            "bg-green-100 text-green-700 border-green-200",

    };

    return (
        <div
            className={`px-5 py-3 rounded-full border font-bold ${
                styles[priority] ||
                "bg-gray-100 text-gray-700 border-gray-200"
            }`}
        >
            {priority || "UNKNOWN"} PRIORITY
        </div>
    );
};


const GuidanceList = ({
    title,
    items,
    emptyMessage,
    numbered = false,
}) => {

    return (
        <div className="border rounded-xl p-5">

            <h3 className="text-lg font-bold mb-4">
                {title}
            </h3>

            {items && items.length > 0 ? (

                <div className="space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="flex gap-3 bg-gray-50 rounded-lg p-4"
                        >

                            {numbered ? (

                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>

                            ) : (

                                <div className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-blue-500" />

                            )}

                            <p className="text-gray-700">
                                {item}
                            </p>

                        </div>

                    ))}

                </div>

            ) : (

                <p className="text-gray-500">
                    {emptyMessage}
                </p>

            )}

        </div>
    );
};


export default EmergencyAccess;