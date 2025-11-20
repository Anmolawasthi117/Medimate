import { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // Stores user data
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on page load
    useEffect(() => {
        const checkUser = async () => {
            try {
                // Matches your backend: router.route("/current-user").get(...)
                const response = await axios.get('/users/current-user');
                setAuth(response.data.data); // Assuming standard API response wrapper
            } catch (error) {
                setAuth(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/users/login', { email, password });
            setAuth(response.data.data.user);
            toast.success("Logged in successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const register = async (userData) => {
        try {
            // Matches your backend: router.route("/").post(registerUser)
            await axios.post('/users', userData);
            toast.success("Registration successful! Please login.");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/users/logout');
            setAuth(null);
            toast.success("Logged out");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);