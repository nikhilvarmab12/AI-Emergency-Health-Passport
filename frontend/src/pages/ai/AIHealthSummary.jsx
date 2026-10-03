import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import aiService from "../../services/aiService";

const AIHealthSummary = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);

    const generateSummary = async () => {
        setLoading(true);

        try {
            const response =
                await aiService.generateHealthSummary();

            setSummary(response);

            toast.success(
                "AI health summary generated successfully."
            );

        } catch (error) {

            console.error(error);

            const message =
                error?.response?.data?.message ||
                "Unable to generate AI health summary. Please complete your health profile first.";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    const getPriorityStyle = (priority) => {

        switch (priority?.toUpperCase()) {

            case "HIGH":
            case "CRITICAL":
                return "bg-red-100 text-red-700 border-red-200";

            case "MODERATE":
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";

            default:
                return "bg-green-100 text-green-700 border-green-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold">
                            AI Health Summary
                        </h1>

                        <p className="text-gray-500 mt-1">
                            AI-powered analysis of your emergency health information
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="px-4 py-2 rounded-lg border font-medium hover:bg-gray-50"
                    >
                        Back to Dashboard
                    </button>

                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* Introduction */}
                {!summary && (
                    <div className="bg-white rounded-2xl border p-8 text-center">

                        <div className="text-5xl mb-4">
                            🤖
                        </div>

                        <h2 className="text-2xl font-bold">
                            Generate Your AI Health Summary
                        </h2>

                        <p className="max-w-2xl mx-auto text-gray-600 mt-3">
                            Our AI-powered system analyzes your health profile
                            and organizes important medical information for
                            quick understanding during an emergency.
                        </p>

                        <button
                            type="button"
                            onClick={generateSummary}
                            disabled={loading}
                            className="mt-6 px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Analyzing Health Information..."
                                : "Generate AI Summary"}
                        </button>

                    </div>
                )}

                {/* Loading */}
                {loading && !summary && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            Analyzing your health information...
                        </p>
                    </div>
                )}

                {/* AI Result */}
                {summary && (
                    <div className="space-y-6">

                        {/* Patient Overview */}
                        <div className="bg-white rounded-2xl border p-6">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Patient
                                    </p>

                                    <h2 className="text-2xl font-bold">
                                        {summary.patientName}
                                    </h2>
                                </div>

                                <div className="flex gap-3">

                                    <div className="border rounded-lg px-4 py-2">
                                        <p className="text-xs text-gray-500">
                                            Blood Group
                                        </p>

                                        <p className="font-bold text-lg">
                                            {summary.bloodGroup || "Not available"}
                                        </p>
                                    </div>

                                    <div
                                        className={`border rounded-lg px-4 py-2 ${getPriorityStyle(
                                            summary.emergencyPriority
                                        )}`}
                                    >
                                        <p className="text-xs">
                                            Emergency Priority
                                        </p>

                                        <p className="font-bold">
                                            {summary.emergencyPriority}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* AI Summary */}
                        <div className="bg-white rounded-2xl border p-6">

                            <h2 className="text-xl font-bold mb-3">
                                AI Emergency Summary
                            </h2>

                            <p className="text-gray-700 leading-7">
                                {summary.summary}
                            </p>

                        </div>

                        {/* Critical Alerts */}
                        <SummaryList
                            title="🚨 Critical Alerts"
                            items={summary.criticalAlerts}
                            emptyMessage="No critical alerts identified."
                        />

                        <div className="grid md:grid-cols-2 gap-6">

                            <SummaryList
                                title="🩺 Medical Conditions"
                                items={summary.medicalConditions}
                                emptyMessage="No medical conditions recorded."
                            />

                            <SummaryList
                                title="💊 Current Medications"
                                items={summary.currentMedications}
                                emptyMessage="No current medications recorded."
                            />

                        </div>

                        {/* Emergency Recommendations */}
                        <SummaryList
                            title="🏥 Emergency Recommendations"
                            items={summary.emergencyRecommendations}
                            emptyMessage="No emergency recommendations available."
                        />

                        {/* Disclaimer */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">

                            <h3 className="font-semibold">
                                ⚠️ Important Disclaimer
                            </h3>

                            <p className="text-sm text-gray-700 mt-2">
                                {summary.disclaimer}
                            </p>

                        </div>

                        {/* Generate Again */}
                        <div className="text-center">

                            <button
                                type="button"
                                onClick={generateSummary}
                                disabled={loading}
                                className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Refreshing Summary..."
                                    : "Refresh AI Summary"}
                            </button>

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
};


const SummaryList = ({
    title,
    items,
    emptyMessage,
}) => {

    return (
        <div className="bg-white rounded-2xl border p-6">

            <h2 className="text-xl font-bold mb-4">
                {title}
            </h2>

            {items && items.length > 0 ? (

                <ul className="space-y-3">

                    {items.map((item, index) => (

                        <li
                            key={`${item}-${index}`}
                            className="bg-gray-50 border rounded-lg p-3 text-gray-700"
                        >
                            {item}
                        </li>

                    ))}

                </ul>

            ) : (

                <p className="text-gray-500">
                    {emptyMessage}
                </p>

            )}

        </div>
    );
};


export default AIHealthSummary;