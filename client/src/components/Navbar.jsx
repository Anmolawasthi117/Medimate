import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Activity, User } from "lucide-react";

const Navbar = () => {
    const { auth, logout } = useAuth();

    return (
        <nav className="main-nav">
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 0' }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
                        borderRadius: '10px',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(14,165,233,0.3)'
                    }}>
                        <Activity size={20} color="#fff" />
                    </div>
                    <span style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em'
                    }}>
                        Medimate
                    </span>
                </Link>

                {/* Nav Items */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {auth ? (
                        <>
                            <Link
                                to="/profile"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    textDecoration: 'none',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    padding: '0.45rem 0.9rem',
                                    borderRadius: 'var(--radius-pill)',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-input)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                    e.currentTarget.style.color = 'var(--primary)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                <div style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '0.7rem',
                                    fontWeight: 700
                                }}>
                                    {auth.username?.charAt(0).toUpperCase()}
                                </div>
                                {auth.username}
                            </Link>
                            <button
                                onClick={logout}
                                className="btn-danger"
                            >
                                <LogOut size={15} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: 'none',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem',
                                    padding: '0.45rem 1rem',
                                    borderRadius: 'var(--radius-pill)',
                                    transition: 'color 0.2s'
                                }}
                            >
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;