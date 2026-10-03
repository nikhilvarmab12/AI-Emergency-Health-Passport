import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import aiService from "../../services/aiService";

const EmergencyGuidance = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [guidance, setGuidance] = useState(null);

    const generateGuidance = async () => {

        setLoading(true);

        try {

            const response =
                await aiService.generateEmergencyGuidance();

            setGuidance(response);

            toast.success(
                "AI emergency guidance generated successfully."
            );

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Unable to generate emergency guidance.";

            toast.error(message);

        } finally {

            setLoading(false);

        }
    };

    const getPriorityStyle = (priority) => {

        switch (priority) {

            case "HIGH":
                return "bg-red-100 text-red-700 border-red-200";

            case "MODERATE":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";

            case "LOW":
                return "bg-green-100 text-green-700 border-green-200";

            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b">

                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">

                    <div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            className="text-sm text-gray-500 hover:text-gray-900 mb-2"
                        >
                            ← Back to Dashboard
                        </button>

                        <h1 className="text-2xl font-bold">
                            AI Emergency Guidance
                        </h1>

                        <p className="text-gray-500 mt-1">
                            AI-assisted emergency precautions and
                            decision-support guidance
                        </p>

                    </div>

                    {guidance && (

                        <div
                            className={`px-4 py-2 rounded-full border font-semibold whitespace-nowrap ${getPriorityStyle(
                                guidance.emergencyPriority
                            )}`}
                        >
                            {guidance.emergencyPriority} PRIORITY
                        </div>

                    )}

                </div>

            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* Initial Screen */}
                {!guidance && (

                    <div className="bg-white rounded-2xl border p-8">

                        <p className="text-sm font-semibold text-blue-600 mb-3">
                            EMERGENCY DECISION SUPPORT
                        </p>

                        <h2 className="text-3xl font-bold">
                            Generate Emergency Guidance
                        </h2>

                        <p className="text-gray-600 mt-4 max-w-3xl leading-7">
                            The system analyzes the available health
                            profile and organizes important precautions,
                            allergy warnings, condition considerations,
                            medication information, and emergency
                            priority actions.
                        </p>

                        <button
                            type="button"
                            onClick={generateGuidance}
                            disabled={loading}
                            className="mt-6 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Generating Guidance..."
                                : "Generate AI Emergency Guidance"}
                        </button>

                    </div>

                )}

                {/* Results */}
                {guidance && (

                    <div className="space-y-6">

                        {/* Patient Overview */}
                        <div className="bg-white rounded-2xl border p-6">

                            <p className="text-sm text-gray-500">
                                Emergency Health Passport
                            </p>

                            <h2 className="text-2xl font-bold mt-1">
                                {guidance.patientName}
                            </h2>

                            <p className="text-gray-700 mt-4 leading-7">
                                {guidance.overallGuidance}
                            </p>

                        </div>

                        {/* Immediate Precautions */}
                        <GuidanceSection
                            title="Immediate Precautions"
                            subtitle="Important factors to review during emergency assessment"
                            items={guidance.immediatePrecautions}
                            emptyMessage="No immediate precautions identified."
                        />

                        {/* Medical Warnings Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            <GuidanceSection
                                title="Allergy Warnings"
                                items={guidance.allergyWarnings}
                                emptyMessage="No recorded allergy warnings."
                            />

                            <GuidanceSection
                                title="Condition Considerations"
                                items={guidance.conditionConsiderations}
                                emptyMessage="No chronic condition considerations available."
                            />

                            <GuidanceSection
                                title="Medication Warnings"
                                items={guidance.medicationWarnings}
                                emptyMessage="No current medication warnings."
                            />

                            <GuidanceSection
                                title="Blood Group Precautions"
                                items={guidance.bloodGroupPrecautions}
                                emptyMessage="No blood group information available."
                            />

                        </div>

                        {/* Priority Actions */}
                        <div className="bg-white rounded-2xl border p-6">

                            <h2 className="text-xl font-bold mb-2">
                                Priority Actions
                            </h2>

                            <p className="text-gray-500 mb-5">
                                Recommended information checks and
                                precautions for emergency care.
                            </p>

                            <div className="space-y-3">

                                {guidance.priorityActions?.map(
                                    (action, index) => (

                                        <div
                                            key={index}
                                            className="flex gap-4 border rounded-xl p-4"
                                        >

                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                                                {index + 1}
                                            </div>

                                            <p className="text-gray-700 pt-1">
                                                {action}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                        {/* Disclaimer */}
                        <div className="border border-yellow-200 bg-yellow-50 rounded-2xl p-5">

                            <h3 className="font-semibold mb-2">
                                Important Medical Disclaimer
                            </h3>

                            <p className="text-sm text-gray-700 leading-6">
                                {guidance.disclaimer}
                            </p>

                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4">

                            <button
                                type="button"
                                onClick={generateGuidance}
                                disabled={loading}
                                className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Refreshing..."
                                    : "Refresh Guidance"}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                className="px-5 py-3 rounded-xl border font-semibold hover:bg-gray-100"
                            >
                                Back to Dashboard
                            </button>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
};


const GuidanceSection = ({
    title,
    subtitle,
    items,
    emptyMessage,
}) => {

    return (
        <div className="bg-white rounded-2xl border p-6">

            <h2 className="text-xl font-bold">
                {title}
            </h2>

            {subtitle && (
                <p className="text-gray-500 mt-2 mb-5">
                    {subtitle}
                </p>
            )}

            {!subtitle && (
                <div className="mb-5" />
            )}

            {items && items.length > 0 ? (

                <div className="space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="bg-gray-50 border rounded-xl p-4"
                        >
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


export default EmergencyGuidance;