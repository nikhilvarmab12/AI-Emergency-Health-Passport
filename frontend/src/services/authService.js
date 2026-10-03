import axiosClient from "../api/axiosClient";

const authService = {

    register: async (data) => {
        const response = await axiosClient.post(
            "/api/v1/auth/register",
            data
        );

        return response.data;
    },

    verifyOtp: async (data) => {
        const response = await axiosClient.post(
            "/api/v1/auth/verify-otp",
            data
        );

        return response.data;
    },

    login: async (data) => {
        const response = await axiosClient.post(
            "/api/v1/auth/login",
            data
        );

        return response.data;
    },

};

export default authService;