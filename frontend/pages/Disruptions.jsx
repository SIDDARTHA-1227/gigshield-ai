import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Activity, CloudRain, Thermometer, Wind, ShieldAlert, WifiOff, Zap } from "lucide-react";

const typeConfig = {
  heavy_rain: { icon: CloudRain, label: "Heavy Rain", threshold: "> 30 mm/hr", unit: "mm/hr" },
  extreme_heat: { icon: Thermometer, label: "Extreme Heat", threshold: "> 40°C", unit: "°C" },
  severe_pollution: { icon: Wind, label: "Severe Pollution", threshold: "AQI > 300", unit: "AQI" },
  zone_shutdown: { icon: ShieldAlert, label: "Zone Shutdown", threshold: "Govt/Platform alert", unit: "" },
  platform_outage: { icon: WifiOff, label: "Platform Outage", threshold: "0 orders > 60 min", unit: "min" },
};

const mockLiveData = {
  temperature: 34,
  rainfall: 0,
  aqi: 125,
  platformStatus: "Online",
  activeWorkers: 342,
  ordersPerHour: 1280,
};

export default function Disruptions() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await base44.entities.DisruptionEvent.list('-created_date', 30);
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
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-space font-bold">Live Monitor</h1>
        </div>
        <p className="text-muted-foreground">Real-time environmental and platform monitoring</p>
      </motion.div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Temperature", value: `${mockLiveData.temperature}°C`, safe: mockLiveData.temperature <= 40 },
          { label: "Rainfall", value: `${mockLiveData.rainfall} mm/hr`, safe: mockLiveData.rainfall < 30 },
          { label: "AQI", value: mockLiveData.aqi, safe: mockLiveData.aqi < 300 },
          { label: "Platform", value: mockLiveData.platformStatus, safe: true },
          { label: "Active Workers", value: mockLiveData.activeWorkers, safe: true },
          { label: "Orders/hr", value: mockLiveData.ordersPerHour, safe: true },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-card rounded-2xl border p-4 text-center ${
              metric.safe ? 'border-border' : 'border-red-300 bg-red-500/5'
            }`}
          >
            <p className={`text-xl font-space font-bold ${metric.safe ? '' : 'text-red-600'}`}>
              {metric.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trigger Thresholds */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-8">
        <h3 className="font-space font-semibold mb-4">Parametric Trigger Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(typeConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Icon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{config.threshold}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Log */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-space font-semibold mb-4">Disruption Event Log</h3>
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No disruption events recorded</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const config = typeConfig[event.type] || typeConfig.heavy_rain;
              const Icon = config.icon;
              return (
                <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{config.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        event.severity === 'critical' ? 'bg-red-500/10 text-red-600' :
                        event.severity === 'severe' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {event.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{event.zone}, {event.city}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{event.affected_workers || 0} workers</p>
                    <p>{event.total_claims_triggered || 0} claims</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
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
    </div>
  );
}