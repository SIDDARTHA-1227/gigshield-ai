import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Activity } from "lucide-react";
import { calculateRiskScore, getRiskLevel, getDynamicPrice, getTriggerReasons } from "../../utils/riskEngine";

const riskStyles = {
  low:    { color: "text-green-600", bg: "bg-green-500/10", bar: "bg-green-500", border: "border-green-200" },
  medium: { color: "text-amber-600", bg: "bg-amber-500/10", bar: "bg-amber-500", border: "border-amber-200" },
  high:   { color: "text-red-600",   bg: "bg-red-500/10",   bar: "bg-red-500",   border: "border-red-200"   },
};

const PREDICTION_LABELS = {
  low:    "Conditions stable",
  medium: "Moderate disruption possible",
  high:   "High disruption probability",
};

// Simulate live fluctuating inputs
function randomInputs() {
  const idleMinutes = [0, 20, 45, 90, 120][Math.floor(Math.random() * 5)];
  return {
    rain: Math.random() > 0.5,
    extremeHeat: Math.random() > 0.7,
    orderAvailability: Math.random() > 0.4 ? "high" : "low",
    idleMinutes,
    riskZone: Math.random() > 0.6 ? "high" : "normal",
  };
}

export default function LiveRiskMonitor({ zone = "Your Zone", onHighRisk }) {
  const [liveInputs, setLiveInputs] = useState({
    rain: true, extremeHeat: false, orderAvailability: "low", idleMinutes: 45, riskZone: "normal"
  });
  const [isLive, setIsLive] = useState(true);
  const [pulse, setPulse] = useState(false);
  const prevLevelRef = useState(null);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newInputs = randomInputs();
      setLiveInputs(newInputs);
      setPulse(true);
      setTimeout(() => setPulse(false), 300);
      // Fire onHighRisk when level crosses into HIGH
      const newScore = calculateRiskScore(newInputs);
      const newLevel = getRiskLevel(newScore);
      if (newLevel === "high" && onHighRisk) {
        onHighRisk(newInputs);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  const score = calculateRiskScore(liveInputs);
  const level = getRiskLevel(score);
  const cfg = riskStyles[level];
  const price = getDynamicPrice(score);
  const reasons = getTriggerReasons(liveInputs);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-space font-semibold text-sm">Live Risk Monitor</h3>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-all ${isLive ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}
        >
          {isLive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isLive ? "Live" : "Paused"}
        </button>
      </div>

      {/* Score */}
      <motion.div animate={{ scale: pulse ? 1.02 : 1 }} transition={{ duration: 0.2 }} className={`${cfg.bg} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Risk Score</span>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className={`font-space font-bold text-4xl ${cfg.color}`}>{score}</span>
          <span className={`text-sm font-semibold mb-1 ${cfg.color}`}>/100</span>
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
            {level.toUpperCase()}
          </span>
        </div>
        <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${score}%` }} transition={{ duration: 0.6, ease: "easeOut" }} className={`h-full rounded-full ${cfg.bar}`} />
        </div>
      </motion.div>

      {/* AI Prediction */}
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${cfg.border} ${cfg.bg}`}>
        <span className={`w-2 h-2 rounded-full ${cfg.bar} ${isLive && level === "high" ? "animate-pulse" : ""} flex-shrink-0`} />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">AI Prediction</p>
          <p className={`text-sm font-semibold ${cfg.color}`}>{PREDICTION_LABELS[level]}</p>
        </div>
      </div>

      {/* Dynamic pricing */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${price.bg}`}>
        <span className="text-xs text-muted-foreground font-medium">AI Dynamic Pricing</span>
        <span className={`font-space font-bold ${price.color}`}>₹{price.price}/week</span>
      </div>

      {/* Zone */}
      <p className="text-xs text-muted-foreground">📍 Zone: <span className="font-medium text-foreground">{zone}</span></p>

      {/* Active Signals */}
      {reasons.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Active Signals</p>
          <div className="space-y-1.5">
            {reasons.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.bar} animate-pulse flex-shrink-0`} />
                <span>{r}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {level === "high" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-red-500/10 border border-red-200 rounded-xl px-3 py-2.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <span className="text-xs font-semibold text-red-600">Claim will auto-trigger — Zero-Touch active</span>
        </motion.div>
      )}
    </div>
  );
}