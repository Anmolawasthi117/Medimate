import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';

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
            setAuth(res.data.data);
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

    const initials = auth?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || auth?.username?.charAt(0).toUpperCase() || 'U';

    return (
        <div style={{ maxWidth: 680, margin: '2.5rem auto', padding: '0 1rem' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        boxShadow: '0 6px 18px rgba(14,165,233,0.3)',
                        flexShrink: 0
                    }}>
                        {initials}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            Account Settings
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Manage your personal info and security
                        </p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="card animate-fade-up" style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="#0ea5e9" />
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Personal Information</h3>
                </div>
                <form onSubmit={updateDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={details.fullName}
                            onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            value={details.email}
                            onChange={(e) => setDetails({ ...details, email: e.target.value })}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem' }}>
                            <Save size={15} /> Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Security */}
            <div className="card animate-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldCheck size={18} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Security</h3>
                </div>
                <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="form-label">Current Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <button type="submit" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                            padding: '0.65rem 1.5rem', borderRadius: 'var(--radius-pill)',
                            border: 'none', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
                            transition: 'all 0.2s ease'
                        }}>
                            <Lock size={15} /> Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;