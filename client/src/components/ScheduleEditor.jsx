import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Clock, Trash2, Plus, Save } from 'lucide-react';

const ScheduleEditor = ({ deviceId }) => {
    const [schedule, setSchedule] = useState([]);
    const [newTime, setNewTime] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch schedule when component mounts
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`/patients/device/${deviceId}`);
                // Ensure we get an array, even if backend returns null
                setSchedule(response.data.data.schedule || []); 
            } catch (error) {
                toast.error("Failed to load schedule");
            } finally {
                setLoading(false);
            }
        };
        if (deviceId) fetchSchedule();
    }, [deviceId]);

    // Add a new time to the list
    const addTime = () => {
        if (!newTime) return;
        if (schedule.includes(newTime)) {
            toast.error("Time already exists");
            return;
        }
        const updatedSchedule = [...schedule, newTime].sort(); // Keep it sorted
        setSchedule(updatedSchedule);
        setNewTime("");
    };

    // Remove a time
    const removeTime = (timeToRemove) => {
        setSchedule(schedule.filter(time => time !== timeToRemove));
    };

    // Save changes to Backend
    const saveSchedule = async () => {
        try {
            await axios.put(`/patients/${deviceId}`, { schedule });
            toast.success("Schedule updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save schedule");
        }
    };

    if (loading) return <div className="p-4 text-gray-500">Loading schedule...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-800">
                <Clock className="text-blue-500" size={20} /> Medication Schedule
            </h3>

            {/* Time List */}
            <div className="space-y-3 mb-6">
                {schedule.length === 0 && (
                    <p className="text-gray-400 italic">No times scheduled yet.</p>
                )}
                {schedule.map((time, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-100">
                        <span className="text-lg font-medium text-gray-700">{time}</span>
                        <button 
                            onClick={() => removeTime(time)}
                            className="text-red-400 hover:text-red-600 transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Time Input */}
            <div className="flex gap-2 mb-6">
                <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border rounded px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                    onClick={addTime}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200 transition flex items-center gap-1"
                >
                    <Plus size={18} /> Add
                </button>
            </div>

            {/* Save Button */}
            <button 
                onClick={saveSchedule}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
            >
                <Save size={18} /> Save Changes
            </button>
        </div>
    );
};

export default ScheduleEditor;