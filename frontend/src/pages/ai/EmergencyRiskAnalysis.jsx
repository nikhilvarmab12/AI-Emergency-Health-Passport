import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import aiService from "../../services/aiService";

const EmergencyRiskAnalysis = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const generateAnalysis = async () => {

        setLoading(true);

        try {

            const response =
                await aiService.generateEmergencyRisk();

            setAnalysis(response);

            toast.success(
                "Emergency risk analysis generated successfully."
            );

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Unable to generate emergency risk analysis.";

            toast.error(message);

        } finally {

            setLoading(false);

        }
    };

    const getRiskStyle = (riskLevel) => {

        switch (riskLevel) {

            case "HIGH":
                return {
                    badge:
                        "bg-red-100 text-red-700 border-red-200",
                    score:
                        "text-red-600",
                };

            case "MODERATE":
                return {
                    badge:
                        "bg-yellow-100 text-yellow-700 border-yellow-200",
                    score:
                        "text-yellow-600",
                };

            case "LOW":
                return {
                    badge:
                        "bg-green-100 text-green-700 border-green-200",
                    score:
                        "text-green-600",
                };

            default:
                return {
                    badge:
                        "bg-gray-100 text-gray-700 border-gray-200",
                    score:
                        "text-gray-600",
                };
        }
    };

    const riskStyle = analysis
        ? getRiskStyle(analysis.riskLevel)
        : null;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b">

                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="text-sm text-gray-500 hover:text-gray-900 mb-2"
                        >
                            ← Back to Dashboard
                        </button>

                        <h1 className="text-2xl font-bold">
                            AI Emergency Risk Analysis
                        </h1>

                        <p className="text-gray-500 mt-1">
                            AI-assisted analysis of critical health factors
                        </p>

                    </div>

                    {analysis && (

                        <div
                            className={`px-4 py-2 rounded-full border font-semibold ${riskStyle.badge}`}
                        >
                            {analysis.riskLevel} RISK
                        </div>

                    )}

                </div>

            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">

                {/* Introduction */}
                {!analysis && (

                    <div className="bg-white rounded-2xl border p-8">

                        <div className="max-w-2xl">

                            <p className="text-sm font-semibold text-purple-600 mb-3">
                                AI-POWERED DECISION SUPPORT
                            </p>

                            <h2 className="text-3xl font-bold">
                                Analyze your emergency health risks
                            </h2>

                            <p className="text-gray-600 mt-4 leading-7">
                                The system analyzes your available health
                                profile to identify important medical factors,
                                estimate an emergency risk level, and generate
                                recommendations for healthcare professionals.
                            </p>

                            <button
                                type="button"
                                onClick={generateAnalysis}
                                disabled={loading}
                                className="mt-6 px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Analyzing Health Profile..."
                                    : "Generate AI Risk Analysis"}
                            </button>

                        </div>

                    </div>

                )}

                {/* Analysis Results */}
                {analysis && (

                    <div className="space-y-6">

                        {/* Top Summary */}
                        <div className="bg-white rounded-2xl border p-6">

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Patient
                                    </p>

                                    <h2 className="text-2xl font-bold mt-1">
                                        {analysis.patientName}
                                    </h2>

                                    <p className="text-gray-600 mt-2">
                                        AI-assisted emergency health assessment
                                    </p>

                                </div>

                                <div className="text-left md:text-right">

                                    <p className="text-sm text-gray-500">
                                        Emergency Risk Score
                                    </p>

                                    <p
                                        className={`text-5xl font-bold mt-1 ${riskStyle.score}`}
                                    >
                                        {analysis.riskScore}
                                        <span className="text-xl text-gray-400">
                                            /100
                                        </span>
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* AI Assessment */}
                        <div className="bg-white rounded-2xl border p-6">

                            <p className="text-sm font-semibold text-purple-600 mb-2">
                                AI ASSESSMENT
                            </p>

                            <h2 className="text-xl font-bold mb-3">
                                Emergency Assessment
                            </h2>

                            <p className="text-gray-700 leading-7">
                                {analysis.aiAssessment}
                            </p>

                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Critical Factors */}
                            <div className="bg-white rounded-2xl border p-6">

                                <h2 className="text-xl font-bold mb-5">
                                    Critical Factors Detected
                                </h2>

                                {analysis.criticalFactors?.length > 0 ? (

                                    <div className="space-y-3">

                                        {analysis.criticalFactors.map(
                                            (factor, index) => (

                                                <div
                                                    key={index}
                                                    className="border rounded-xl p-4 bg-gray-50"
                                                >
                                                    <p className="font-medium">
                                                        {factor}
                                                    </p>
                                                </div>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <p className="text-gray-500">
                                        No critical factors were identified
                                        from the available health profile.
                                    </p>

                                )}

                            </div>

                            {/* Recommended Actions */}
                            <div className="bg-white rounded-2xl border p-6">

                                <h2 className="text-xl font-bold mb-5">
                                    Recommended Emergency Actions
                                </h2>

                                <div className="space-y-3">

                                    {analysis.recommendedActions?.map(
                                        (action, index) => (

                                            <div
                                                key={index}
                                                className="flex gap-3 border rounded-xl p-4"
                                            >

                                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold">
                                                    {index + 1}
                                                </div>

                                                <p className="text-gray-700">
                                                    {action}
                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* Disclaimer */}
                        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                            <h3 className="font-semibold mb-2">
                                Important Disclaimer
                            </h3>

                            <p className="text-sm text-gray-700 leading-6">
                                {analysis.disclaimer}
                            </p>

                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4">

                            <button
                                type="button"
                                onClick={generateAnalysis}
                                disabled={loading}
                                className="px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Refreshing..."
                                    : "Refresh Analysis"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="px-5 py-3 rounded-xl border font-semibold hover:bg-gray-50"
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

export default EmergencyRiskAnalysis;