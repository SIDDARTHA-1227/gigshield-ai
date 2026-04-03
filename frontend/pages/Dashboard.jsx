import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, TrendingUp, Clock, Zap, CloudRain, Bot } from "lucide-react";
import StatsCard from "../components/dashboard/StatsCard";
import AIRiskBadge from "../components/dashboard/AIRiskBadge";
import DisruptionBanner from "../components/dashboard/DisruptionBanner";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import ShiftTimeline from "../components/dashboard/ShiftTimeline";
import RiskSimulator from "../components/dashboard/RiskSimulator";
import LiveRiskMonitor from "../components/dashboard/LiveRiskMonitor";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [worker, setWorker] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highRiskTrigger, setHighRiskTrigger] = useState(null);

  useEffect(() => {
    async function load() {
      const [me, workerList, eventList, claimList] = await Promise.all([
        base44.auth.me(),
        base44.entities.Worker.list('-created_date', 1),
        base44.entities.DisruptionEvent.filter({ status: 'active' }),
        base44.entities.Claim.list('-created_date', 5),
      ]);
      setCurrentUser(me);
      setWorker(workerList[0] || null);
      setEvents(eventList);
      setClaims(claimList);
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

  const planLabel = worker?.active_plan && worker.active_plan !== 'none' 
    ? worker.active_plan.charAt(0).toUpperCase() + worker.active_plan.slice(1) 
    : 'No Plan';

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-space font-bold text-foreground">
          Welcome back{currentUser?.full_name ? `, ${currentUser.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-muted-foreground mt-1 mb-3">
          Your income protection dashboard • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <div className="flex flex-wrap gap-2">
          <AIRiskBadge riskScore={worker?.risk_score || 'medium'} label="AI Risk Score" />
          {events.length > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              AI Prediction: Disruption Active
            </span>
          )}
        </div>
      </motion.div>

      {/* Active Disruption Banner */}
      <DisruptionBanner events={events} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          icon={Shield} 
          label="Active Plan" 
          value={planLabel}
          subtext={worker?.active_plan !== 'none' ? `Since ${worker?.plan_start_date || 'N/A'}` : 'Subscribe to get protected'}
          color="primary" 
          delay={0}
        />
        <StatsCard 
          icon={TrendingUp} 
          label="Weekly Payout" 
          value={`₹${worker?.total_payout_this_week || 0}`}
          subtext={`${worker?.total_claims_this_week || 0} claims this week`}
          color="success" 
          delay={0.1}
        />
        <StatsCard 
          icon={Clock} 
          label="Avg Hourly Earnings" 
          value={`₹${worker?.avg_hourly_earnings || 0}`}
          subtext={`₹${worker?.avg_daily_earnings || 0}/day average`}
          color="info" 
          delay={0.2}
        />
        <StatsCard 
          icon={CloudRain} 
          label="Active Disruptions" 
          value={events.length}
          subtext={events.length > 0 ? 'Claims auto-triggering' : 'All clear in your zone'}
          color={events.length > 0 ? 'danger' : 'success'} 
          delay={0.3}
        />
      </div>

      {/* AI Risk Engine + Live Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3">
          <RiskSimulator worker={worker} externalTrigger={highRiskTrigger} />
        </div>
        <div className="lg:col-span-2">
          <LiveRiskMonitor zone={worker?.zone || 'Your Zone'} onHighRisk={setHighRiskTrigger} />
        </div>
      </div>

      {/* Charts & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-2">
          <ShiftTimeline />
        </div>
      </div>

      {/* Recent Claims */}
      {claims.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-space font-semibold">Recent Claims</h3>
            <span className="inline-flex items-center gap-1 text-xs bg-violet-500/10 text-violet-600 px-2 py-0.5 rounded-full font-medium">
              <Bot className="w-3 h-3" /> Auto-Processed
            </span>
          </div>
          <div className="space-y-3">
            {claims.map((claim) => (
              <div key={claim.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{claim.disruption_type?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{claim.zone} • {claim.status}</p>
                </div>
                <span className="font-space font-bold text-sm">₹{claim.final_payout || 0}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}