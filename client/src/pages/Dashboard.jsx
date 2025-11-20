import { useState, useEffect } from 'react';
import axios from '../api/axios';
import ScheduleEditor from '../components/ScheduleEditor';
import AdherenceChart from '../components/AdherenceChart';
import { Activity, ClipboardList, Settings, Wifi, RefreshCw, BarChart3, CalendarClock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [deviceId, setDeviceId] = useState(localStorage.getItem("medimate_device_id") || "");
    const [isConnected, setIsConnected] = useState(!!localStorage.getItem("medimate_device_id"));
    
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [refreshing, setRefreshing] = useState(false);

    // Handle manual device connection
    const handleConnect = (e) => {
        e.preventDefault();
        const id = e.target.elements.deviceId.value;
        if(id) {
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

    // Fetch Logs
    const fetchLogs = async () => {
        if (!deviceId) return;
        setRefreshing(true);
        try {
            const response = await axios.get(`/logs/${deviceId}`);
            // Sort logs: Newest first
            const sortedLogs = response.data.data.sort((a, b) => new Date(b.actualTime) - new Date(a.actualTime));
            setLogs(sortedLogs);
        } catch (error) {
            console.error("Error fetching logs", error);
        } finally {
            setRefreshing(false);
        }
    };

    // Auto-fetch logs when connected
    useEffect(() => {
        if (isConnected) {
            fetchLogs();
            const interval = setInterval(fetchLogs, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [isConnected, deviceId]);

    // UI: Connect Screen
    if (!isConnected) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[80vh]">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
                        <Wifi className="text-blue-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Connect Device</h2>
                    <p className="text-gray-500 mb-6">Enter your Medimate Device ID (e.g., esp123) to manage schedules and view logs.</p>
                    <form onSubmit={handleConnect} className="flex gap-2">
                        <input 
                            name="deviceId"
                            type="text" 
                            placeholder="Device ID..." 
                            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            Connect
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // UI: Dashboard
    return (
        <div className="container mx-auto p-4 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="text-green-500" /> 
                        Device: {deviceId}
                    </h1>
                    <p className="text-sm text-gray-500">Status: {logs.length > 0 ? "Online" : "Waiting for data..."}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchLogs} disabled={refreshing} className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition" title="Refresh Logs">
                        <RefreshCw size={20} className={refreshing ? "animate-spin text-blue-600" : "text-gray-600"} />
                    </button>
                    <button onClick={handleDisconnect} className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded transition border border-transparent hover:border-red-100">
                        Disconnect
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b pb-1 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'overview' ? 'bg-white border-t border-x border-gray-200 text-blue-600 font-medium -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <ClipboardList size={18} /> Overview
                </button>
                <button 
                    onClick={() => setActiveTab("reports")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'reports' ? 'bg-white border-t border-x border-gray-200 text-blue-600 font-medium -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <BarChart3 size={18} /> Reports
                </button>
                <button 
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${activeTab === 'settings' ? 'bg-white border-t border-x border-gray-200 text-blue-600 font-medium -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Settings size={18} /> Settings
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid gap-6 animate-in fade-in duration-300">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-gray-500 text-sm mb-1">Total Logs</h3>
                                <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-gray-500 text-sm mb-1">Last Activity</h3>
                                <p className="text-lg font-medium text-gray-800">
                                    {logs.length > 0 ? new Date(logs[0].actualTime).toLocaleTimeString() : "N/A"}
                                </p>
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-gray-500 text-sm mb-1">Latest Status</h3>
                                <p className={`text-lg font-medium ${
                                    logs.length > 0 && logs[0].status === 'taken' ? 'text-green-600' : 
                                    logs.length > 0 && logs[0].status === 'missed' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {logs.length > 0 ? logs[0].status.toUpperCase() : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Logs Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <CalendarClock className="text-gray-400" size={20}/>
                                <h3 className="font-semibold text-gray-700">Recent Activity</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="p-3 font-medium">Date</th>
                                            <th className="p-3 font-medium">Scheduled</th>
                                            <th className="p-3 font-medium">Actual Time</th>
                                            <th className="p-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-400">No activity logs found yet.</td>
                                            </tr>
                                        ) : (
                                            logs.slice(0, 10).map((log) => (
                                                <tr key={log._id} className="hover:bg-gray-50">
                                                    <td className="p-3 text-gray-600">
                                                        {new Date(log.actualTime).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3 font-medium">{log.scheduledTime}</td>
                                                    <td className="p-3 text-gray-500">
                                                        {new Date(log.actualTime).toLocaleTimeString()}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            log.status === 'taken' ? 'bg-green-100 text-green-700' : 
                                                            log.status === 'missed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
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
                    <div className="animate-in fade-in duration-300">
                        <AdherenceChart deviceId={deviceId} />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-in fade-in duration-300">
                        <ScheduleEditor deviceId={deviceId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;