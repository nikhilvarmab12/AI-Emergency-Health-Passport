import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HeartPulse } from "lucide-react";
import authService from "../../services/authService";

const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: "PATIENT",
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

        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name.");
            return;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email.");
            return;
        }

        if (!formData.password) {
            toast.error("Please enter a password.");
            return;
        }

        if (!formData.phoneNumber.trim()) {
            toast.error("Please enter your phone number.");
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register(formData);

            toast.success(
                response?.message ||
                "Registration successful. OTP has been sent to your email."
            );

            navigate("/verify-otp", {
                state: {
                    email: formData.email,
                },
            });

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Registration failed. Please try again.";

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
                        Create your health passport
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Register to set up your Emergency Health Passport
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Full name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={inputClass}
                                autoComplete="name"
                                required
                                disabled={loading}
                            />
                        </div>

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
                                placeholder="example@gmail.com"
                                className={inputClass}
                                autoComplete="email"
                                required
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                Use a valid email address. An OTP will be sent here.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Phone number
                            </label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+91XXXXXXXXXX"
                                className={inputClass}
                                autoComplete="tel"
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
                                placeholder="Create a password"
                                className={inputClass}
                                autoComplete="new-password"
                                required
                                minLength={8}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-slate-700"
                            >
                                Account type
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={inputClass}
                                disabled={loading}
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="DOCTOR">Doctor</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-semibold text-teal-800 hover:underline"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
