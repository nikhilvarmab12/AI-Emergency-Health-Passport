import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import patientService from "../../services/patientService";

const HealthProfile = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        heightCm: "",
        weightKg: "",
        allergies: "",
        chronicDiseases: "",
        currentMedications: "",
        previousSurgeries: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
        medicalNotes: "",
    });

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response =
                    await patientService.getProfile();

                if (response) {

                    setFormData({
                        dateOfBirth: response.dateOfBirth || "",
                        gender: response.gender || "",
                        bloodGroup: response.bloodGroup || "",
                        heightCm: response.heightCm || "",
                        weightKg: response.weightKg || "",
                        allergies: response.allergies || "",
                        chronicDiseases:
                            response.chronicDiseases || "",
                        currentMedications:
                            response.currentMedications || "",
                        previousSurgeries:
                            response.previousSurgeries || "",
                        emergencyContactName:
                            response.emergencyContactName || "",
                        emergencyContactPhone:
                            response.emergencyContactPhone || "",
                        emergencyContactRelation:
                            response.emergencyContactRelation || "",
                        medicalNotes:
                            response.medicalNotes || "",
                    });

                }

            } catch (error) {

                /*
                 * A profile may not exist yet.
                 * In that case we simply show an empty form.
                 */
                if (error?.response?.status !== 404) {

                    toast.error(
                        error?.response?.data?.message ||
                        "Unable to load health profile."
                    );

                }

            } finally {

                setLoading(false);

            }
        };

        loadProfile();

    }, []);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        try {

            const data = {
                ...formData,

                heightCm:
                    formData.heightCm
                        ? Number(formData.heightCm)
                        : null,

                weightKg:
                    formData.weightKg
                        ? Number(formData.weightKg)
                        : null,
            };

            await patientService.createOrUpdateProfile(data);

            toast.success(
                "Health profile saved successfully."
            );

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                "Unable to save health profile."
            );

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading health profile...</p>
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-50">

            {/* Header */}

            <header className="bg-white border-b">

                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div>

                        <h1 className="text-xl font-bold">
                            Health Profile
                        </h1>

                        <p className="text-sm text-gray-500">
                            Emergency Health Passport
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

            {/* Form */}

            <main className="max-w-5xl mx-auto px-6 py-8">

                <div className="bg-white rounded-xl border p-6">

                    <div className="mb-8">

                        <h2 className="text-2xl font-bold">
                            Medical Information
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Keep your emergency medical information
                            accurate and up to date.
                        </p>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >

                        {/* Basic Information */}

                        <section>

                            <h3 className="text-lg font-semibold mb-4">
                                Basic Information
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Date of Birth
                                    </label>

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Gender
                                    </label>

                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    >
                                        <option value="">
                                            Select
                                        </option>
                                        <option value="Male">
                                            Male
                                        </option>
                                        <option value="Female">
                                            Female
                                        </option>
                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Blood Group
                                    </label>

                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    >
                                        <option value="">
                                            Select
                                        </option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Height (cm)
                                    </label>

                                    <input
                                        type="number"
                                        name="heightCm"
                                        value={formData.heightCm}
                                        onChange={handleChange}
                                        placeholder="175"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Weight (kg)
                                    </label>

                                    <input
                                        type="number"
                                        name="weightKg"
                                        value={formData.weightKg}
                                        onChange={handleChange}
                                        placeholder="68"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                            </div>

                        </section>

                        {/* Medical Information */}

                        <section>

                            <h3 className="text-lg font-semibold mb-4">
                                Critical Medical Information
                            </h3>

                            <div className="space-y-4">

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Allergies
                                    </label>

                                    <textarea
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        placeholder="Example: Penicillin, peanuts"
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Chronic Diseases
                                    </label>

                                    <textarea
                                        name="chronicDiseases"
                                        value={formData.chronicDiseases}
                                        onChange={handleChange}
                                        placeholder="Example: Asthma, diabetes"
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Current Medications
                                    </label>

                                    <textarea
                                        name="currentMedications"
                                        value={formData.currentMedications}
                                        onChange={handleChange}
                                        placeholder="List current medications"
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Previous Surgeries
                                    </label>

                                    <textarea
                                        name="previousSurgeries"
                                        value={formData.previousSurgeries}
                                        onChange={handleChange}
                                        placeholder="List previous surgeries"
                                        rows="3"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                            </div>

                        </section>

                        {/* Emergency Contact */}

                        <section>

                            <h3 className="text-lg font-semibold mb-4">
                                Emergency Contact
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Contact Name
                                    </label>

                                    <input
                                        type="text"
                                        name="emergencyContactName"
                                        value={
                                            formData.emergencyContactName
                                        }
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="emergencyContactPhone"
                                        value={
                                            formData.emergencyContactPhone
                                        }
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Relationship
                                    </label>

                                    <input
                                        type="text"
                                        name="emergencyContactRelation"
                                        value={
                                            formData.emergencyContactRelation
                                        }
                                        onChange={handleChange}
                                        placeholder="Father"
                                        className="w-full border rounded-lg px-4 py-3"
                                    />
                                </div>

                            </div>

                        </section>

                        {/* Medical Notes */}

                        <section>

                            <h3 className="text-lg font-semibold mb-4">
                                Additional Medical Notes
                            </h3>

                            <textarea
                                name="medicalNotes"
                                value={formData.medicalNotes}
                                onChange={handleChange}
                                placeholder="Any additional medical information that emergency personnel should know"
                                rows="5"
                                className="w-full border rounded-lg px-4 py-3"
                            />

                        </section>

                        {/* Save */}

                        <div className="flex justify-end">

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Health Profile"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>

    );
};

export default HealthProfile;