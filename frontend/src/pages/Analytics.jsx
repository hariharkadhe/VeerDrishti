import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, Filter, Download } from 'lucide-react';

const Analytics = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/alerts/')
      .then(res => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch alerts for analytics", err);
        setLoading(false);
      });
  }, []);

  // Process data for charts
  const typeCounts = {};
  const locationCounts = {};

  alerts.forEach(alert => {
    typeCounts[alert.event_type] = (typeCounts[alert.event_type] || 0) + 1;
    locationCounts[alert.location] = (locationCounts[alert.location] || 0) + 1;
  });

  const pieData = Object.keys(typeCounts).map(key => ({
    name: key,
    value: typeCounts[key]
  }));

  const barData = Object.keys(locationCounts).map(key => ({
    name: key.split(' ')[0], // abbreviate
    Incidents: locationCounts[key]
  }));

  const COLORS = ['#39ff14', '#ef4444', '#f59e0b', '#22c55e', '#a855f7'];

  const handleExport = () => {
    if (alerts.length === 0) return;
    const headers = ['ID', 'Event Type', 'Severity', 'Confidence', 'Location', 'Timestamp', 'Status'];
    const csvContent = [
      headers.join(','),
      ...alerts.map(a => [
        a.id, 
        `"${a.event_type}"`, 
        a.severity, 
        `${(a.confidence * 100).toFixed(1)}%`, 
        `"${a.location}"`, 
        a.timestamp, 
        a.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sentinel_intel_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative z-10 space-y-6">
      <div className="flex justify-between items-end mb-8 border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-glow-primary text-primary">Intelligence Analytics</h1>
          <p className="text-primary/70 mt-2 font-mono tracking-widest text-xs uppercase">Historical Threat Reports & Vector Analysis</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-black/60 text-primary border border-primary/50 shadow-[inset_0_0_10px_rgba(57,255,20,0.1)] rounded-none text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2 hover:bg-primary/20 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-primary/20 text-primary border border-primary text-glow-primary shadow-neon-primary rounded-none text-xs font-mono tracking-widest uppercase font-bold flex items-center gap-2 hover:bg-primary/30 transition-colors">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incident Distribution Pie Chart */}
        <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] flex flex-col h-[400px]">
          <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-4">
            <div className="p-2 bg-primary/20 border border-primary text-primary shadow-neon-primary rounded-none">
              <Activity size={20} />
            </div>
            <h2 className="text-xl font-bold text-primary tracking-widest uppercase font-mono">Threat Distribution</h2>
          </div>
          
          <div className="flex-1 relative min-h-0">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-primary/50 font-mono tracking-widest uppercase text-sm animate-pulse">Processing Data...</div>
            ) : pieData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-primary/50 font-mono tracking-widest uppercase text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="rgba(0,0,0,0.8)"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', borderColor: 'rgba(57, 255, 20, 0.5)', borderRadius: '0px', color: '#39ff14', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#39ff14' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="square" wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', textTransform: 'uppercase', color: '#39ff14' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Hotspots Bar Chart */}
        <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] flex flex-col h-[400px]">
          <div className="flex items-center gap-3 mb-6 border-b border-warning/20 pb-4">
            <div className="p-2 bg-warning/20 border border-warning text-warning shadow-neon-warning rounded-none">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-xl font-bold text-warning tracking-widest uppercase font-mono">Sector Hotspots</h2>
          </div>
          
          <div className="flex-1 relative min-h-0">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-warning/50 font-mono tracking-widest uppercase text-sm animate-pulse">Processing Data...</div>
            ) : barData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-warning/50 font-mono tracking-widest uppercase text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(57,255,20,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="#39ff14" tick={{fill: '#39ff14', fontFamily: 'monospace', fontSize: 10}} />
                  <YAxis stroke="#39ff14" tick={{fill: '#39ff14', fontFamily: 'monospace', fontSize: 10}} allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', borderColor: 'rgba(57, 255, 20, 0.5)', borderRadius: '0px', fontFamily: 'monospace' }}
                    cursor={{fill: 'rgba(57,255,20,0.1)'}}
                  />
                  <Bar dataKey="Incidents" fill="#39ff14" radius={[0, 0, 0, 0]} barSize={40}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Incident Logs Table */}
      <div className="glass-panel p-6 border border-primary/30 shadow-[inset_0_0_15px_rgba(57,255,20,0.1)] mt-8">
        <h3 className="text-xl font-bold mb-6 text-primary tracking-widest uppercase font-mono border-b border-primary/20 pb-4">Incident Records Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs tracking-widest">
            <thead>
              <tr className="border-b border-primary/50 text-primary/70 uppercase">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Vector</th>
                <th className="py-3 px-4 font-semibold">Coordinates</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {alerts.slice(0, 50).map((alert, idx) => (
                <tr key={idx} className="border-b border-primary/10 hover:bg-primary/10 transition-colors text-primary">
                  <td className="py-3 px-4">#{alert.id}</td>
                  <td className="py-3 px-4 font-bold uppercase">{alert.event_type}</td>
                  <td className="py-3 px-4 text-primary/70">{alert.location}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-black border border-primary/30 text-primary rounded-none font-bold shadow-[inset_0_0_5px_rgba(57,255,20,0.2)]">
                      {(alert.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-none font-bold uppercase ${
                      alert.status === 'NEW' ? 'bg-danger/20 text-danger border border-danger/50 shadow-neon-danger' : 
                      alert.status === 'CLOSED' ? 'bg-primary/20 text-primary border border-primary/50 shadow-neon-primary' : 
                      'bg-warning/20 text-warning border border-warning/50 shadow-neon-warning'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && !loading && (
            <div className="text-center py-8 text-primary/50 font-mono tracking-widest uppercase text-sm">No incident records found in matrix.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
