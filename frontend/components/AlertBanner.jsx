import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, label, value, subtext, color = "primary", delay = 0 }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600",
    warning: "bg-amber-500/10 text-amber-600",
    danger: "bg-red-500/10 text-red-600",
    info: "bg-blue-500/10 text-blue-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-space font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      {subtext && <p className="text-xs text-muted-foreground/70 mt-2">{subtext}</p>}
    </motion.div>
  );
}