import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";

import emergencyService from "../../services/emergencyService";

const EmergencyPassport = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [passport, setPassport] = useState(null);

    const handleGenerate = async () => {

        setLoading(true);

        try {

            const response =
                await emergencyService.generateQr();

            setPassport(response);

            toast.success(
                "Emergency Health Passport generated successfully."
            );

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Unable to generate Emergency Health Passport."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <header className="bg-white border-b">

                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>
                        <h1 className="text-xl font-bold">
                            Emergency Health Passport
                        </h1>

                        <p className="text-sm text-gray-500">
                            Secure emergency medical access
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="px-4 py-2 rounded-lg border"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </header>

            {/* Main */}

            <main className="max-w-5xl mx-auto px-6 py-10">

                <div className="bg-white rounded-2xl border p-8">

                    <div className="text-center mb-8">

                        <h2 className="text-3xl font-bold">
                            Your Emergency Passport
                        </h2>

                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                            Generate a secure QR code that allows authorized
                            emergency personnel to quickly access your
                            critical medical information.
                        </p>

                    </div>

                    {!passport && (

                        <div className="text-center py-10">

                            <div className="text-6xl mb-6">
                                🏥
                            </div>

                            <h3 className="text-xl font-semibold">
                                Emergency access is ready
                            </h3>

                            <p className="text-gray-500 mt-2 mb-6">
                                Generate your emergency access QR code.
                            </p>

                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={loading}
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
                            >
                                {loading
                                    ? "Generating..."
                                    : "Generate Emergency Access"
                                }
                            </button>

                        </div>

                    )}

                    {passport && (

                        <div className="space-y-8">

                            {/* Success */}

                            <div className="text-center">

                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 text-2xl">
                                    ✓
                                </div>

                                <h3 className="text-xl font-bold mt-4">
                                    Emergency Passport Ready
                                </h3>

                                <p className="text-gray-500 mt-1">
                                    Scan the QR code to access emergency
                                    medical information.
                                </p>

                            </div>

                            {/* QR Code */}

                            <div className="flex justify-center">

                                <div className="bg-white border rounded-2xl p-6 shadow-sm">

                                    <QRCodeCanvas
                                        value={passport.accessUrl}
                                        size={240}
                                        level="H"
                                    />

                                </div>

                            </div>

                            {/* Access URL */}

                            <div>

                                <label className="block font-semibold mb-2">
                                    Emergency Access URL
                                </label>

                                <div className="bg-gray-100 border rounded-lg p-4 break-all text-sm">
                                    {passport.accessUrl}
                                </div>

                            </div>

                            {/* Patient Information */}

                            {passport.patientName && (

                                <div>

                                    <h3 className="text-xl font-bold mb-4">
                                        Emergency Information
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">

                                        <InfoCard
                                            label="Patient"
                                            value={passport.patientName}
                                        />

                                        <InfoCard
                                            label="Blood Group"
                                            value={passport.bloodGroup}
                                        />

                                        <InfoCard
                                            label="Allergies"
                                            value={passport.allergies}
                                        />

                                        <InfoCard
                                            label="Chronic Diseases"
                                            value={passport.chronicDiseases}
                                        />

                                        <InfoCard
                                            label="Current Medications"
                                            value={passport.currentMedications}
                                        />

                                        <InfoCard
                                            label="Previous Surgeries"
                                            value={passport.previousSurgeries}
                                        />

                                        <InfoCard
                                            label="Emergency Contact"
                                            value={
                                                passport.emergencyContactName
                                            }
                                        />

                                        <InfoCard
                                            label="Contact Phone"
                                            value={
                                                passport.emergencyContactPhone
                                            }
                                        />

                                    </div>

                                </div>

                            )}

                            {/* Open Passport */}

                            <div className="flex justify-center">

                                <a
                                    href={passport.accessUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold"
                                >
                                    Open Emergency Passport
                                </a>

                            </div>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};

const InfoCard = ({ label, value }) => {

    return (
        <div className="border rounded-xl p-4">

            <p className="text-sm text-gray-500">
                {label}
            </p>

            <p className="font-semibold mt-1">
                {value || "Not provided"}
            </p>

        </div>
    );

};

export default EmergencyPassport;