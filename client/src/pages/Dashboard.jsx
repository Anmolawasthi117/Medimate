import { useState, useEffect } from 'react';
import axios from '../api/axios';
import ScheduleEditor from '../components/ScheduleEditor';
import AdherenceChart from '../components/AdherenceChart';
import { Activity, ClipboardList, Settings, Wifi, RefreshCw, BarChart3, CalendarClock, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StatCard = ({ label, value, color, bg, icon: Icon }) => (
    <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color={color} />
        </div>
        <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{label}</p>
            <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [deviceId, setDeviceId] = useState(localStorage.getItem("medimate_device_id") || "");
    const [isConnected, setIsConnected] = useState(!!localStorage.getItem("medimate_device_id"));
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [refreshing, setRefreshing] = useState(false);

    const handleConnect = (e) => {
        e.preventDefault();
        const id = e.target.elements.deviceId.value;
        if (id) {
            setDeviceId(id);
            localStorage.setItem("medimate_device_id", id);
            setIsConnected(true);
            toast.success(`Connected to ${id}`);
        }
    };

    const handleDisconnect = () => {
        localStorage.removeItem("medimate_device_id");
        setDeviceId("");
        setIsConnected(false);
        setLogs([]);
    };

    const fetchLogs = async () => {
        if (!deviceId) return;
        setRefreshing(true);
        try {
            const response = await axios.get(`/logs/${deviceId}`);
            const sortedLogs = response.data.data.sort((a, b) => new Date(b.actualTime) - new Date(a.actualTime));
            setLogs(sortedLogs);
        } catch (error) {
            console.error("Error fetching logs", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isConnected) {
            fetchLogs();
            const interval = setInterval(fetchLogs, 10000);
            return () => clearInterval(interval);
        }
    }, [isConnected, deviceId]);

    // Connect Screen
    if (!isConnected) {
        return (
            <div style={{
                minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}>
                <div className="card animate-fade-up" style={{ maxWidth: 460, width: '100%', textAlign: 'center', padding: '2.5rem 2rem' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 4px 16px rgba(14,165,233,0.12)',
                        border: '1px solid #bfdbfe'
                    }}>
                        <Wifi size={34} color="#0ea5e9" />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                        Connect Your Device
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                        Enter your Medimate Device ID to manage schedules and view medication logs.
                    </p>
                    <form onSubmit={handleConnect} style={{ display: 'flex', gap: '0.6rem' }}>
                        <input
                            name="deviceId"
                            type="text"
                            placeholder="e.g. esp123"
                            className="input-field"
                            style={{ flex: 1 }}
                            required
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: 10, whiteSpace: 'nowrap' }}>
                            Connect
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Dashboard screen
    return (
        <div style={{ maxWidth: 1000, margin: '2rem auto', padding: '0 1rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '1.75rem', gap: '1rem',
                background: '#fff', borderRadius: 'var(--radius)', padding: '1.1rem 1.4rem',
                boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bfdbfe' }}>
                        <Activity size={20} color="#0ea5e9" />
                    </div>
                    <div>
                        <h1 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            Device: <span style={{ color: 'var(--primary)' }}>{deviceId}</span>
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: logs.length > 0 ? '#10b981' : '#94a3b8' }} />
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {logs.length > 0 ? 'Online' : 'Waiting for data...'}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button onClick={fetchLogs} disabled={refreshing} className="btn-secondary" style={{ padding: '0.5rem' }} title="Refresh">
                        <RefreshCw size={17} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                    </button>
                    <button onClick={handleDisconnect} className="btn-danger">
                        Disconnect
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
                <StatCard label="Total Logs" value={logs.length} color="#0ea5e9" bg="#eff6ff" icon={ClipboardList} />
                <StatCard label="Last Activity" value={logs.length > 0 ? new Date(logs[0].actualTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"} color="#14b8a6" bg="#f0fdfa" icon={CalendarClock} />
                <StatCard
                    label="Latest Status"
                    value={logs.length > 0 ? logs[0].status.toUpperCase() : "N/A"}
                    color={logs.length > 0 ? (logs[0].status === 'taken' ? '#10b981' : '#ef4444') : '#94a3b8'}
                    bg={logs.length > 0 ? (logs[0].status === 'taken' ? '#f0fdf4' : '#fef2f2') : '#f8faff'}
                    icon={Zap}
                />
            </div>

            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', background: '#fff', padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', width: 'fit-content' }}>
                {[
                    { id: 'overview', label: 'Overview', icon: ClipboardList },
                    { id: 'reports',  label: 'Reports',  icon: BarChart3 },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ].map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`tab-btn ${activeTab === id ? 'active' : ''}`}
                    >
                        <Icon size={16} /> {label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: 400 }}>
                {activeTab === 'overview' && (
                    <div className="animate-fade-up">
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8faff' }}>
                                <CalendarClock size={18} color="var(--text-muted)" />
                                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Recent Activity</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="med-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Scheduled</th>
                                            <th>Actual Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                                    No activity logs found yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.slice(0, 10).map((log) => (
                                                <tr key={log._id}>
                                                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(log.actualTime).toLocaleDateString()}</td>
                                                    <td style={{ fontWeight: 600 }}>{log.scheduledTime}</td>
                                                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(log.actualTime).toLocaleTimeString()}</td>
                                                    <td>
                                                        <span className={
                                                            log.status === 'taken' ? 'badge-taken' :
                                                            log.status === 'missed' ? 'badge-missed' : 'badge-default'
                                                        }>
                                                            {log.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="animate-fade-up">
                        <AdherenceChart deviceId={deviceId} />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-fade-up">
                        <ScheduleEditor deviceId={deviceId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;