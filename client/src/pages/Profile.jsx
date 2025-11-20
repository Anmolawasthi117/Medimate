import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';

const Profile = () => {
    const { auth, setAuth } = useAuth();
    const [details, setDetails] = useState({
        fullName: auth?.fullName || "",
        email: auth?.email || ""
    });
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: ""
    });

    const updateDetails = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch('/users/update-account', details);
            setAuth(res.data.data); // Update context with new user info
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/users/change-password', passwords);
            toast.success("Password changed successfully");
            setPasswords({ oldPassword: "", newPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h1>

            {/* Update Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
                    <User size={20} className="text-blue-500" /> Personal Information
                </h3>
                <form onSubmit={updateDetails} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Full Name</label>
                        <input 
                            type="text" 
                            value={details.fullName}
                            onChange={(e) => setDetails({...details, fullName: e.target.value})}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email Address</label>
                        <input 
                            type="email" 
                            value={details.email}
                            onChange={(e) => setDetails({...details, email: e.target.value})}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2">
                        <Save size={16} /> Update Info
                    </button>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-700">
                    <Lock size={20} className="text-orange-500" /> Security
                </h3>
                <form onSubmit={changePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Current Password</label>
                        <input 
                            type="password" 
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">New Password</label>
                        <input 
                            type="password" 
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition flex items-center gap-2">
                        <Lock size={16} /> Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;