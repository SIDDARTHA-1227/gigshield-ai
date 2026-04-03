import { Brain } from "lucide-react";

export default function AIRiskBadge({ riskScore = "medium", score = null, label = "AI Risk Score" }) {
  const config = {
    low: { color: "text-green-600", bg: "bg-green-500/10", dot: "bg-green-500", text: "Low" },
    medium: { color: "text-amber-600", bg: "bg-amber-500/10", dot: "bg-amber-500", text: "Medium" },
    high: { color: "text-red-600", bg: "bg-red-500/10", dot: "bg-red-500", text: "High" },
  };
  const c = config[riskScore] || config.medium;

  return (
    <div className={`inline-flex items-center gap-2 ${c.bg} px-3 py-1.5 rounded-xl`}>
      <Brain className={`w-3.5 h-3.5 ${c.color}`} />
      <span className={`text-xs font-semibold ${c.color}`}>{label}:</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse-glow`} />
        <span className={`text-xs font-bold ${c.color}`}>
          {score !== null ? `${score}%` : c.text}
        </span>
      </div>
    </div>
  );
}