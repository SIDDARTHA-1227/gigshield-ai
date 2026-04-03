import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Users, FileText, AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Admin() {
  const [workers, setWorkers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [w, c, e] = await Promise.all([
        base44.entities.Worker.list('-created_date', 100),
        base44.entities.Claim.list('-created_date', 100),
        base44.entities.DisruptionEvent.list('-created_date', 50),
      ]);
      setWorkers(w);
      setClaims(c);
      setEvents(e);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalPayouts = claims.reduce((s, c) => s + (c.final_payout || 0), 0);
  const approvedClaims = claims.filter(c => c.status === 'approved').length;
  const rejectedClaims = claims.filter(c => c.status === 'rejected').length;
  const activeEvents = events.filter(e => e.status === 'active').length;

  const claimsByType = claims.reduce((acc, c) => {
    const type = c.disruption_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(claimsByType).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  const COLORS = ['hsl(252,60%,52%)', 'hsl(38,92%,55%)', 'hsl(160,60%,45%)', 'hsl(340,75%,55%)', 'hsl(200,70%,50%)'];

  const fraudData = [
    { score: "Score 3 (Clean)", count: claims.filter(c => c.fraud_score === 3).length },
    { score: "Score 2 (Review)", count: claims.filter(c => c.fraud_score === 2).length },
    { score: "Score 1 (Flag)", count: claims.filter(c => c.fraud_score === 1).length },
    { score: "Score 0 (Reject)", count: claims.filter(c => c.fraud_score === 0).length },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-space font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">Platform analytics, worker management, and fraud monitoring</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Users} label="Total Workers" value={workers.length} color="primary" delay={0} />
        <StatsCard icon={FileText} label="Total Claims" value={claims.length} subtext={`${approvedClaims} approved, ${rejectedClaims} rejected`} color="info" delay={0.1} />
        <StatsCard icon={TrendingUp} label="Total Payouts" value={`₹${totalPayouts.toLocaleString()}`} color="success" delay={0.2} />
        <StatsCard icon={AlertTriangle} label="Active Disruptions" value={activeEvents} color="danger" delay={0.3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Claims by Type */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-space font-semibold mb-4">Claims by Disruption Type</h3>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No claims data yet</p>
          )}
        </div>

        {/* Fraud Score Distribution */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-space font-semibold mb-4">Fraud Score Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fraudData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,16%,90%)" vertical={false} />
                <XAxis dataKey="score" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(220,10%,46%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220,10%,46%)' }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(252,60%,52%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8">
        <h3 className="font-space font-semibold mb-4">Registered Workers</h3>
        {workers.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No workers registered yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">City</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Zone</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Platform</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Plan</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Weekly Payout</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{w.full_name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{w.city}</td>
                    <td className="py-3 px-4 text-muted-foreground">{w.zone}</td>
                    <td className="py-3 px-4">{w.platform}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        w.active_plan === 'premium' ? 'bg-amber-500/10 text-amber-600' :
                        w.active_plan === 'standard' ? 'bg-violet-500/10 text-violet-600' :
                        w.active_plan === 'basic' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {w.active_plan || 'none'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        w.risk_score === 'high' ? 'bg-red-500/10 text-red-600' :
                        w.risk_score === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-green-500/10 text-green-600'
                      }`}>
                        {w.risk_score || 'low'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-space font-semibold">₹{w.total_payout_this_week || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Events */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-space font-semibold mb-4">Recent Disruption Events</h3>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No events recorded</p>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 10).map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                <Activity className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.type?.replace(/_/g, ' ')} — {event.zone}</p>
                  <p className="text-xs text-muted-foreground">{event.city} • {event.severity}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.status === 'active' ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}