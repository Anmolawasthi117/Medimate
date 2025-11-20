import { useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(formData);
        if (success) navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text" placeholder="Full Name"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                    />
                    <input
                        type="text" placeholder="Username"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <input
                        type="email" placeholder="Email"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    <input
                        type="password" placeholder="Password"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;