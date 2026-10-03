import axiosClient from "../api/axiosClient";

const patientService = {

    getProfile: async () => {
        const response = await axiosClient.get(
            "/api/v1/patients/profile"
        );

        return response.data;
    },

    createOrUpdateProfile: async (data) => {
        const response = await axiosClient.post(
            "/api/v1/patients/profile",
            data
        );

        return response.data;
    },

};

export default patientService;