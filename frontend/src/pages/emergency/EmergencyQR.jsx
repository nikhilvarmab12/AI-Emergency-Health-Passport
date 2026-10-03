import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import emergencyService from "../../services/emergencyService";

const EmergencyQR = () => {
    const navigate = useNavigate();

    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateQR = async () => {
        setLoading(true);

        try {
            const response = await emergencyService.generateQr();

            setQrData(response);

            toast.success(
                "Emergency QR generated successfully."
            );
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Unable to generate emergency QR.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const accessUrl = qrData
        ? `${window.location.origin}/emergency/access/${qrData.accessToken}`
        : "";

    const copyAccessUrl = async () => {
        try {
            await navigator.clipboard.writeText(accessUrl);

            toast.success("Emergency access link copied.");
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            toast.error("Unable to copy the access link.");
        }
    };

    const openEmergencyPassport = () => {
        if (accessUrl) {
            window.open(accessUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white px-4 py-10">

            <div className="max-w-4xl mx-auto">

                {/* Header */}

                <div className="flex items-center justify-between mb-10">

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="text-sm text-slate-300 hover:text-white transition"
                    >
                        ← Back to Dashboard
                    </button>

                    <div className="text-sm text-emerald-400 font-medium">
                        ● Secure Emergency Access
                    </div>

                </div>

                {/* Title */}

                <div className="text-center mb-10">

                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-5">

                        <span className="text-3xl">
                            🚨
                        </span>

                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Emergency Health Passport
                    </h1>

                    <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                        Generate a secure QR code that allows authorized
                        emergency personnel to quickly access your critical
                        medical information.
                    </p>

                </div>

                {/* Main Card */}

                <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

                    {!qrData ? (

                        /* BEFORE GENERATION */

                        <div className="p-8 md:p-12 text-center">

                            <div className="mx-auto w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">

                                <span className="text-4xl">
                                    📱
                                </span>

                            </div>

                            <h2 className="text-2xl font-bold mb-3">
                                Create Your Emergency QR
                            </h2>

                            <p className="text-slate-400 max-w-xl mx-auto mb-8">
                                Your QR code provides a fast way for emergency
                                responders to access essential medical
                                information when you may be unable to communicate.
                            </p>

                            <button
                                type="button"
                                onClick={generateQR}
                                disabled={loading}
                                className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? "Generating Secure QR..."
                                    : "Generate Emergency QR"}
                            </button>

                            {/* Security information */}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left">

                                <SecurityItem
                                    icon="🔐"
                                    title="Secure"
                                    description="Unique access token protects your passport."
                                />

                                <SecurityItem
                                    icon="⚡"
                                    title="Fast"
                                    description="Critical information can be accessed quickly."
                                />

                                <SecurityItem
                                    icon="🏥"
                                    title="Emergency Ready"
                                    description="Designed for emergency medical situations."
                                />

                            </div>

                        </div>

                    ) : (

                        /* AFTER GENERATION */

                        <div>

                            {/* Success header */}

                            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-5 text-center">

                                <div className="text-emerald-400 text-2xl mb-2">
                                    ✓
                                </div>

                                <h2 className="text-xl font-bold">
                                    Emergency Passport Ready
                                </h2>

                                <p className="text-sm text-slate-400 mt-1">
                                    Your secure emergency access QR code has
                                    been generated.
                                </p>

                            </div>

                            <div className="p-6 md:p-10">

                                {/* QR */}

                                <div className="flex justify-center">

                                    <div className="bg-white p-5 md:p-7 rounded-2xl shadow-xl">

                                        <QRCodeSVG
                                            value={accessUrl}
                                            size={280}
                                            level="H"
                                            includeMargin
                                        />

                                    </div>

                                </div>

                                {/* Instructions */}

                                <div className="text-center mt-8">

                                    <h3 className="text-2xl font-bold">
                                        Scan to Access Emergency Information
                                    </h3>

                                    <p className="text-slate-400 mt-3 max-w-xl mx-auto">
                                        An authorized emergency responder can
                                        scan this QR code to access your critical
                                        medical information.
                                    </p>

                                </div>

                                {/* Status */}

                                <div className="flex justify-center mt-6">

                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">

                                        <span>●</span>
                                        Emergency access active

                                    </div>

                                </div>

                                {/* Access URL */}

                                <div className="mt-8">

                                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                                        Emergency Access Link
                                    </label>

                                    <div className="bg-slate-950 border border-slate-700 rounded-xl p-4">

                                        <p className="text-sm text-slate-400 break-all leading-relaxed">
                                            {accessUrl}
                                        </p>

                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">

                                        <button
                                            type="button"
                                            onClick={copyAccessUrl}
                                            className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold transition"
                                        >
                                            📋 Copy Access Link
                                        </button>

                                        <button
                                            type="button"
                                            onClick={openEmergencyPassport}
                                            className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition"
                                        >
                                            Open Passport
                                        </button>

                                    </div>

                                </div>

                                {/* Generate new */}

                                <div className="text-center mt-8 pt-8 border-t border-slate-800">

                                    <p className="text-sm text-slate-500 mb-4">
                                        Need to create a new emergency access token?
                                    </p>

                                    <button
                                        type="button"
                                        onClick={generateQR}
                                        disabled={loading}
                                        className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 font-semibold transition disabled:opacity-50"
                                    >
                                        {loading
                                            ? "Generating..."
                                            : "Generate New QR"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* Footer warning */}

                <div className="mt-8 text-center">

                    <p className="text-xs text-slate-500 max-w-2xl mx-auto">
                        This Emergency Health Passport contains sensitive
                        medical information. Share the QR code only when
                        necessary for emergency medical assistance.
                    </p>

                </div>

            </div>

        </div>
    );
};


/* Security information component */

const SecurityItem = ({
    icon,
    title,
    description,
}) => {
    return (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

            <div className="text-2xl mb-3">
                {icon}
            </div>

            <h3 className="font-semibold mb-1">
                {title}
            </h3>

            <p className="text-sm text-slate-500">
                {description}
            </p>

        </div>
    );
};

export default EmergencyQR;