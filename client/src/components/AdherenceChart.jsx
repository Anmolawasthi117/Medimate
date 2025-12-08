import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from '../api/axios';
import { FileBarChart } from 'lucide-react';

const AdherenceChart = ({ deviceId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/esp/${deviceId}/report`);
        const api = response.data.data;

        console.log("API RAW:", api);

        // --- Transform dailyStats → Array for Recharts ---
        const transformed = Object.entries(api.dailyStats || {}).map(
          ([date, stats]) => ({
            date,
            ...stats
          })
        );

        console.log("TRANSFORMED DATA:", transformed);

        setData(transformed);
      } catch (error) {
        console.error("Error loading report", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (deviceId) fetchReport();
  }, [deviceId]);

  if (loading)
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        Loading Chart...
      </div>
    );

  if (data.length === 0)
    return (
      <div className="h-80 flex items-center justify-center text-gray-400">
        No data available for this week.
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-6 text-gray-800">
        <FileBarChart className="text-purple-500" size={20} /> Weekly Adherence
      </h3>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
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
