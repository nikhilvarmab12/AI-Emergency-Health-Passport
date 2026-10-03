import axiosClient from "../api/axiosClient";

const emergencyService = {

    generateQr: async () => {
        const response = await axiosClient.post(
            "/api/v1/emergency/qr"
        );

        return response.data;
    },

    getEmergencyAccess: async (token) => {
        const response = await axiosClient.get(
            `/api/v1/emergency/access/${token}`
        );

        return response.data;
    },
    getEmergencyGuidance: async (token) => {
    const response = await axiosClient.get(
        `/api/v1/emergency/access/${token}/ai-guidance`
    );

    return response.data;
},
getAccessHistory: async () => {
    const response = await axiosClient.get(
        "/api/v1/emergency/access-history"
    );

    return response.data;
},

};

export default emergencyService;