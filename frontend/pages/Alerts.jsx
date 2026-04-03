import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Bell, CloudRain, Thermometer, Wind, ShieldAlert, WifiOff, TrendingUp, MapPin } from "lucide-react";

const typeConfig = {
  heavy_rain: { icon: CloudRain, label: "Heavy Rainfall", color: "text-blue-500", bg: "bg-blue-500/10" },
  extreme_heat: { icon: Thermometer, label: "Extreme Heat", color: "text-red-500", bg: "bg-red-500/10" },
  severe_pollution: { icon: Wind, label: "Severe Pollution", color: "text-amber-500", bg: "bg-amber-500/10" },
  zone_shutdown: { icon: ShieldAlert, label: "Zone Shutdown", color: "text-violet-500", bg: "bg-violet-500/10" },
  platform_outage: { icon: WifiOff, label: "Platform Outage", color: "text-gray-500", bg: "bg-gray-500/10" },
};

const mockAlerts = [
  {
    id: 1,
    type: "heavy_rain",
    message: "Heavy rainfall expected during dinner shift tomorrow (7-10 PM). Consider rescheduling.",
    zone: "Guntur Central",
    probability: 78,
    time: "Tomorrow, 7:00 PM",
    severity: "high",
  },
  {
    id: 2,
    type: "extreme_heat",
    message: "Temperature forecast to exceed 42°C during lunch hours. Stay hydrated and take breaks.",
    zone: "Guntur South",
    probability: 65,
    time: "Day after tomorrow, 12:00 PM",
    severity: "moderate",
  },
  {
    id: 3,
    type: "severe_pollution",
    message: "AQI levels may reach 320+ in the morning. Consider wearing protective mask.",
    zone: "Guntur Industrial",
    probability: 52,
    time: "In 3 days",
    severity: "moderate",
  },
];

export default function Alerts() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.DisruptionEvent.list('-created_date', 20);
      setEvents(data);
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

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-space font-bold">Risk Alerts</h1>
        </div>
        <p className="text-muted-foreground">
          AI-powered predictive alerts to help you plan ahead and stay safe.
        </p>
      </motion.div>

      {/* Predictive Alerts */}
      <h2 className="font-space font-semibold text-lg mb-4">Upcoming Predictions</h2>
      <div className="space-y-4 mb-10">
        {mockAlerts.map((alert, i) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{config.label}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.severity === 'high' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {alert.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {alert.probability}% probability
                    </span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Past Events */}
      <h2 className="font-space font-semibold text-lg mb-4">Recent Disruption Events</h2>
      {events.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No recent events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const config = typeConfig[event.type] || typeConfig.heavy_rain;
            const Icon = config.icon;
            return (
              <div key={event.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{event.zone} • {event.city}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.status === 'active' ? 'bg-red-500/10 text-red-600' :
                  event.status === 'monitoring' ? 'bg-amber-500/10 text-amber-600' :
                  'bg-green-500/10 text-green-600'
                }`}>
                  {event.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}