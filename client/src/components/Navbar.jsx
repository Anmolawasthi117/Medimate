import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Activity, User } from "lucide-react";

const Navbar = () => {
    const { auth, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold flex items-center gap-2">
                    <Activity /> Medimate
                </Link>
                
                <div className="flex gap-4 items-center">
                    {auth ? (
                        <>
                            <Link 
                                to="/profile" 
                                className="text-sm font-medium hover:bg-blue-700 px-3 py-1 rounded transition flex items-center gap-2"
                                title="Go to Profile"
                            >
                                <User size={18} /> {auth.username}
                            </Link>
                            <button 
                                onClick={logout} 
                                className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900 px-3 py-1 rounded transition text-sm"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:underline">Login</Link>
                            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded font-medium hover:bg-gray-100">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;