import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
  PieChart, Pie, Cell, Tooltip as PieTooltip
} from 'recharts';
import axios from '../api/axios';
import { BarChart3, TrendingUp, PieChart as PieIcon, CheckCircle2, XCircle, Activity, Percent } from 'lucide-react';

// ── Color palette ───────────────────────────────────────────────
const COLORS = { taken: '#10b981', missed: '#ef4444' };
const PIE_COLORS = ['#10b981', '#ef4444', '#94a3b8'];

// ── Reusable summary card ────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, color, bg, sub }) => (
  <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</p>
      {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{sub}</p>}
    </div>
  </div>
);

// ── Custom tooltip ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
      <p style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)', fontSize: '0.82rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: '0.82rem', fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.name.includes('%') ? `${p.value}%` : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Chart section wrapper ────────────────────────────────────────
const ChartCard = ({ title, icon: Icon, iconColor, iconBg, children }) => (
  <div className="card" style={{ marginBottom: '1.25rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={iconColor} />
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
    </div>
    {children}
  </div>
);

// ── Loading state ────────────────────────────────────────────────
const Spinner = () => (
  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #0ea5e9', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
);

// ── Main component ───────────────────────────────────────────────
const AdherenceChart = ({ deviceId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/esp/${deviceId}/report?days=365`);
        const api = response.data.data;
        const transformed = Object.entries(api.dailyStats || {})
          .map(([date, stats]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            taken: stats.taken || 0,
            missed: stats.missed || 0,
            total: (stats.taken || 0) + (stats.missed || 0),
            rate: stats.taken && (stats.taken + stats.missed) > 0
              ? Math.round((stats.taken / (stats.taken + stats.missed)) * 100)
              : 0
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(transformed);
      } catch (error) {
        console.error('Error loading report', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    if (deviceId) fetchReport();
  }, [deviceId]);

  // ── Derived stats ──────────────────────────────────────────────
  const totalTaken  = data.reduce((s, d) => s + d.taken, 0);
  const totalMissed = data.reduce((s, d) => s + d.missed, 0);
  const totalDoses  = totalTaken + totalMissed;
  const adherenceRate = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 0;

  const pieData = [
    { name: 'Taken',   value: totalTaken },
    { name: 'Missed',  value: totalMissed },
  ].filter(d => d.value > 0);

  // ── Loading ────────────────────────────────────────────────────
  if (loading) return (
    <div className="card" style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
      <Spinner /> Loading report...
    </div>
  );

  // ── No data ────────────────────────────────────────────────────
  if (data.length === 0) return (
    <div className="card" style={{ minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
      <BarChart3 size={42} color="#cbd5e1" />
      <p style={{ fontWeight: 600 }}>No report data available yet.</p>
      <p style={{ fontSize: '0.85rem' }}>Data will appear once the device logs activity.</p>
    </div>
  );

  // ── Report ─────────────────────────────────────────────────────
  return (
    <div className="animate-fade-up">

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <SummaryCard icon={CheckCircle2} label="Total Taken"  value={totalTaken}  color="#10b981" bg="#f0fdf4" sub={`of ${totalDoses} doses`} />
        <SummaryCard icon={XCircle}     label="Total Missed" value={totalMissed} color="#ef4444" bg="#fef2f2" sub={`of ${totalDoses} doses`} />
        <SummaryCard icon={Percent}     label="Adherence"    value={`${adherenceRate}%`} color={adherenceRate >= 80 ? '#10b981' : adherenceRate >= 50 ? '#f59e0b' : '#ef4444'} bg={adherenceRate >= 80 ? '#f0fdf4' : adherenceRate >= 50 ? '#fffbeb' : '#fef2f2'} sub="overall rate" />
        <SummaryCard icon={Activity}    label="Days Tracked" value={data.length}  color="#0ea5e9" bg="#eff6ff" sub="days with data" />
      </div>

      {/* Bar Chart – Taken vs Missed per Day */}
      <ChartCard title="Daily Doses — Taken vs Missed" icon={BarChart3} iconColor="#6366f1" iconBg="#f5f3ff">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.82rem', paddingTop: '0.75rem' }} />
            <Bar dataKey="taken"  fill={COLORS.taken}  name="Taken"  radius={[6,6,0,0]} maxBarSize={48} />
            <Bar dataKey="missed" fill={COLORS.missed} name="Missed" radius={[6,6,0,0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Area Chart – Adherence Trend */}
      <ChartCard title="Adherence Rate Trend (%)" icon={TrendingUp} iconColor="#0ea5e9" iconBg="#eff6ff">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              fill="url(#rateGradient)"
              dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#0ea5e9' }}
              name="Adherence %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bottom Row: Pie Chart + Summary Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>

        {/* Pie Chart */}
        <ChartCard title="Overall Breakdown" icon={PieIcon} iconColor="#14b8a6" iconBg="#f0fdfa">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <PieChart width={180} height={180}>
              <Pie data={pieData} cx={85} cy={85} innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <PieTooltip formatter={(v, n) => [`${v} doses`, n]} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.82rem' }} />
            </PieChart>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {pieData.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {entry.name}: <strong style={{ color: 'var(--text-primary)' }}>{entry.value}</strong>
                  </span>
                </div>
              ))}
              <div style={{ marginTop: '0.25rem', padding: '0.4rem 0.75rem', background: adherenceRate >= 80 ? '#f0fdf4' : '#fef2f2', borderRadius: 8, display: 'inline-block' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: adherenceRate >= 80 ? '#10b981' : '#ef4444' }}>
                  {adherenceRate}% Adherence
                </span>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Daily Summary Table */}
        <ChartCard title="Daily Summary" icon={BarChart3} iconColor="#f59e0b" iconBg="#fffbeb">
          <div style={{ overflowX: 'auto', maxHeight: 220, overflowY: 'auto' }}>
            <table className="med-table" style={{ fontSize: '0.82rem' }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Taken</th>
                  <th style={{ textAlign: 'center' }}>Missed</th>
                  <th style={{ textAlign: 'center' }}>Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.date}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{row.taken}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>{row.missed}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: row.rate >= 80 ? '#d1fae5' : row.rate >= 50 ? '#fef3c7' : '#fee2e2',
                        color:      row.rate >= 80 ? '#065f46' : row.rate >= 50 ? '#92400e' : '#991b1b',
                      }}>
                        {row.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

      </div>
    </div>
  );
};

export default AdherenceChart;
