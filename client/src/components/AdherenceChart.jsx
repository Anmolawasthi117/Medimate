import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from '../api/axios';
import { FileBarChart } from 'lucide-react';

const AdherenceChart = ({ deviceId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`/esp/${deviceId}/report`);
                console.log("Report API Response:", response.data); // Debugging log

                let rawData = response.data.data;

                // --- FIX 1: Ensure Data is ALWAYS an Array ---
                if (!rawData) {
                    rawData = [];
                } else if (!Array.isArray(rawData)) {
                    // If backend returns a single object (e.g., aggregate stats), wrap it in an array
                    rawData = [rawData];
                }

                setData(rawData); 
            } catch (error) {
                console.error("Error loading report", error);
                setData([]); // Fallback to empty array on error
            } finally {
                setLoading(false);
            }
        };

        if (deviceId) fetchReport();
    }, [deviceId]);

    if (loading) return <div className="h-80 flex items-center justify-center text-gray-400">Loading Chart...</div>;

    if (data.length === 0) return <div className="h-80 flex items-center justify-center text-gray-400">No data available for this week.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800">
                <FileBarChart className="text-purple-500" size={20} /> Weekly Adherence
            </h3>
            
            {/* --- FIX 2: Explicit Dimensions on Parent Wrapper --- */}
            {/* We set w-full and h-80 (320px) explicitly so Recharts knows the size */}
            <div style={{ width: '100%', height: 320 }}> 
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        {/* Ensure _id exists in your data, otherwise fallback to index */}
                        <XAxis dataKey="_id" /> 
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="taken" fill="#22c55e" name="Taken" radius={[4, 4, 0, 0]} barSize={40} />
                        <Bar dataKey="missed" fill="#ef4444" name="Missed" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdherenceChart;