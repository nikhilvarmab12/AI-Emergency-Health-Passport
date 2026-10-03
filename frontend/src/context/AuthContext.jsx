import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Failed to load stored user:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);

        localStorage.setItem("token", response.token);

        const userData = {
            userId: response.userId,
            fullName: response.fullName,
            email: response.email,
            role: response.role,
        };

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);

        return response;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: Boolean(user),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );
    }

    return context;
};