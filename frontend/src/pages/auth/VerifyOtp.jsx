import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HeartPulse } from "lucide-react";
import authService from "../../services/authService";

const VerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Email information is missing. Please register again.");
            navigate("/register");
            return;
        }

        if (!otp.trim()) {
            toast.error("Please enter the OTP.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            toast.error("OTP must be exactly 6 digits.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.verifyOtp({
                email: email,
                otp: otp,
            });

            toast.success(
                response?.message ||
                "Email verified successfully."
            );

            navigate("/login");

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "OTP verification failed. Please try again.";

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-teal-700 text-white">
                        <HeartPulse className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
                        MedPass AI
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                        Verify your email
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Enter the 6-digit code sent to your email.
                    </p>
                    {email && (
                        <p className="mt-2 text-sm font-medium text-slate-800">
                            {email}
                        </p>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium text-slate-700"
                            >
                                One-time password
                            </label>
                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={otp}
                                onChange={(event) => {
                                    const value =
                                        event.target.value.replace(/\D/g, "");

                                    setOtp(value);
                                }}
                                placeholder="000000"
                                disabled={loading}
                                aria-invalid={otp.length > 0 && otp.length !== 6}
                                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-3 text-center font-mono text-2xl tracking-[0.4em] text-slate-900 outline-none transition placeholder:tracking-[0.2em] placeholder:text-slate-300 focus:border-teal-700 focus:bg-white focus:ring-2 focus:ring-teal-700/15 disabled:opacity-60"
                            />
                            <p className="mt-1.5 text-center text-xs text-slate-500">
                                {otp.length}/6 digits
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Verify email"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Didn&apos;t receive the OTP?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold text-teal-800 hover:underline"
                    >
                        Register again
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
