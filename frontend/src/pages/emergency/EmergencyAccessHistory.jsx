import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import emergencyService from "../../services/emergencyService";

const EmergencyAccessHistory = () => {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAccessHistory = async () => {

            try {

                const response =
                    await emergencyService.getAccessHistory();

                setHistory(response);

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Unable to load emergency access history.";

                toast.error(message);

            } finally {

                setLoading(false);

            }
        };

        fetchAccessHistory();

    }, []);

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "Not available";
        }

        return new Date(dateValue).toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white border-b">

                <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold">
                            Emergency Access History
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Monitor when your Emergency Health Passport was accessed
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

            <main className="max-w-5xl mx-auto px-6 py-10">

                {loading ? (

                    <div className="bg-white border rounded-xl p-10 text-center">

                        <p className="text-gray-600">
                            Loading access history...
                        </p>

                    </div>

                ) : history.length === 0 ? (

                    <div className="bg-white border rounded-xl p-10 text-center">

                        <h2 className="text-xl font-semibold">
                            No Emergency Access Records
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your Emergency Health Passport has not been accessed yet.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {history.map((log) => (

                            <div
                                key={log.id}
                                className="bg-white border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                            >

                                <div>

                                    <h2 className="font-semibold text-lg">
                                        {log.accessType === "PASSPORT_VIEWED"
                                            ? "Emergency Passport Viewed"
                                            : log.accessType}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Accessed: {formatDate(log.accessedAt)}
                                    </p>

                                </div>

                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        log.success
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {log.success
                                        ? "Successful"
                                        : "Failed"}
                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
};

export default EmergencyAccessHistory;