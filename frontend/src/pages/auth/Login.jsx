import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (!formData.password) {
            toast.error("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const response = await login(formData);

            toast.success(
                response?.message || "Login successful."
            );

            // Temporary destination after login
            navigate("/dashboard");

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Login failed. Please check your credentials.";

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
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to access your Emergency Health Passport
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={inputClass}
                                autoComplete="email"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={inputClass}
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold text-teal-800 hover:underline"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
