import axiosClient from "../api/axiosClient";

const aiService = {

    generateHealthSummary: async () => {
        const response = await axiosClient.get(
            "/api/v1/ai/health-summary"
        );

        return response.data;
    },

    generateEmergencyRisk: async () => {
        const response = await axiosClient.get(
            "/api/v1/ai/emergency-risk"
        );

        return response.data;
    },

    generateEmergencyGuidance: async () => {
        const response = await axiosClient.get(
            "/api/v1/ai/emergency-guidance"
        );

        return response.data;
    },

};

export default aiService;