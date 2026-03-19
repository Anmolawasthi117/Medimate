import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, AtSign, Mail, Lock, Activity, ArrowRight } from "lucide-react";

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

    const fields = [
        { key: "fullName",  label: "Full Name",    type: "text",     placeholder: "John Doe",          icon: User },
        { key: "username",  label: "Username",      type: "text",     placeholder: "john_doe",          icon: AtSign },
        { key: "email",     label: "Email address", type: "email",    placeholder: "you@example.com",   icon: Mail },
        { key: "password",  label: "Password",      type: "password", placeholder: "••••••••",          icon: Lock },
    ];

    return (
        <div className="auth-bg">
            <div className="auth-card animate-fade-up">
                {/* Brand */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
                        borderRadius: 16,
                        boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
                        marginBottom: '1rem'
                    }}>
                        <Activity size={28} color="#fff" />
                    </div>
                    <h1 style={{
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.03em',
                        marginBottom: '0.25rem'
                    }}>
                        Create your account
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Start managing your medications today
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
                        <div key={key}>
                            <label className="form-label">{label}</label>
                            <div style={{ position: 'relative' }}>
                                <Icon size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                                <input
                                    type={type}
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder={placeholder}
                                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
                        Create account <ArrowRight size={16} />
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign in →
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;