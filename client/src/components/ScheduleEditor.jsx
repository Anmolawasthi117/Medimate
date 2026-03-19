import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Clock, Trash2, Plus, Save } from 'lucide-react';

const ScheduleEditor = ({ deviceId }) => {
    const [schedule, setSchedule] = useState([]);
    const [newTime, setNewTime] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`/patients/device/${deviceId}`);
                setSchedule(response.data.data.schedule || []);
            } catch (error) {
                toast.error("Failed to load schedule");
            } finally {
                setLoading(false);
            }
        };
        if (deviceId) fetchSchedule();
    }, [deviceId]);

    const addTime = () => {
        if (!newTime) return;
        if (schedule.includes(newTime)) { toast.error("Time already exists"); return; }
        setSchedule([...schedule, newTime].sort());
        setNewTime("");
    };

    const removeTime = (timeToRemove) => {
        setSchedule(schedule.filter(t => t !== timeToRemove));
    };

    const saveSchedule = async () => {
        try {
            await axios.put(`/patients/${deviceId}`, { schedule });
            toast.success("Schedule updated successfully!");
        } catch (error) {
            toast.error("Failed to save schedule");
        }
    };

    if (loading) return (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #0ea5e9', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            Loading schedule...
        </div>
    );

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={18} color="#0ea5e9" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Medication Schedule</h3>
            </div>

            {/* Time Slots */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem', minHeight: 40 }}>
                {schedule.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No times scheduled yet.</p>
                ) : (
                    schedule.map((time, index) => (
                        <div key={index} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                            border: '1px solid #bfdbfe',
                            borderRadius: 'var(--radius-pill)',
                            padding: '0.45rem 0.85rem',
                            fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)'
                        }}>
                            <Clock size={13} />
                            {time}
                            <button
                                onClick={() => removeTime(time)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: 0, marginLeft: '0.1rem' }}
                                title="Remove"
                            >
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Time */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <input
                    type="time"
                    className="input-field"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button onClick={addTime} className="btn-secondary" style={{ gap: '0.3rem', borderRadius: 10, padding: '0 1rem', flexShrink: 0 }}>
                    <Plus size={16} /> Add
                </button>
            </div>

            {/* Save */}
            <button onClick={saveSchedule} className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                <Save size={16} /> Save Schedule
            </button>
        </div>
    );
};

export default ScheduleEditor;