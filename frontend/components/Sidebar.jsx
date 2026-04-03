import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CloudRain, Thermometer, Wind, WifiOff, ShieldAlert } from "lucide-react";

const iconMap = {
  heavy_rain: CloudRain,
  extreme_heat: Thermometer,
  severe_pollution: Wind,
  zone_shutdown: ShieldAlert,
  platform_outage: WifiOff,
};

const labelMap = {
  heavy_rain: "Heavy Rainfall",
  extreme_heat: "Extreme Heat",
  severe_pollution: "Severe Pollution",
  zone_shutdown: "Zone Shutdown",
  platform_outage: "Platform Outage",
};

export default function DisruptionBanner({ events = [] }) {
  if (events.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border border-red-200 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="font-space font-semibold text-foreground">Active Disruptions</h3>
          <span className="ml-auto text-xs bg-red-500/20 text-red-600 px-2.5 py-1 rounded-full font-medium">
            {events.length} Active
          </span>
        </div>
        <div className="grid gap-2">
          {events.map((event, i) => {
            const Icon = iconMap[event.type] || AlertTriangle;
            return (
              <div key={i} className="flex items-center gap-3 bg-card/60 rounded-xl px-4 py-3">
                <Icon className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">{labelMap[event.type]}</span>
                <span className="text-xs text-muted-foreground">• {event.zone}</span>
                <span className="ml-auto text-xs text-muted-foreground">{event.severity}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}