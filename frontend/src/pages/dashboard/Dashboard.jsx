import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import patientService from "../../services/patientService";
import emergencyService from "../../services/emergencyService";
import DashboardHero from "./dashboard/DashboardHero";
import ProfileCompletion from "./dashboard/ProfileCompletion";
import EmergencyReadiness from "./dashboard/EmergencyReadiness";
import RecentActivity from "./dashboard/RecentActivity";

const Dashboard = () => {

    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profileError, setProfileError] = useState("");
    const [historyError, setHistoryError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            const [profileResult, historyResult] = await Promise.allSettled([
                patientService.getProfile(),
                emergencyService.getAccessHistory(),
            ]);

            if (profileResult.status === "fulfilled") {
                setProfile(profileResult.value);
            } else if (profileResult.reason?.response?.status !== 404) {
                setProfileError(
                    profileResult.reason?.response?.data?.message ||
                    "Your health profile could not be loaded."
                );
            }

            if (historyResult.status === "fulfilled") {
                setHistory(historyResult.value);
            } else {
                setHistoryError(
                    historyResult.reason?.response?.data?.message ||
                    "Emergency access history could not be loaded."
                );
            }

            setLoading(false);
        };

        loadDashboard();
    }, []);

    return (
        <AppLayout title="Dashboard">

            <div className="space-y-6">

                <DashboardHero profile={profile} loading={loading} />

                <div className="grid gap-6 xl:grid-cols-2">
                    <ProfileCompletion
                        profile={profile}
                        loading={loading}
                        error={profileError}
                    />

                    <EmergencyReadiness
                        profile={profile}
                        loading={loading}
                        error={profileError}
                    />
                </div>

                <RecentActivity
                    history={history}
                    loading={loading}
                    error={historyError}
                />

            </div>

        </AppLayout>
    );
};

export default Dashboard;
