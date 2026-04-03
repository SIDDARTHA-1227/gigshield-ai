import { CloudRain, Thermometer, Wind, ShieldAlert, WifiOff, CheckCircle, Clock, XCircle, AlertTriangle, Bot, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const typeIconMap = {
  heavy_rain: CloudRain,
  extreme_heat: Thermometer,
  severe_pollution: Wind,
  zone_shutdown: ShieldAlert,
  platform_outage: WifiOff,
};

const typeLabelMap = {
  heavy_rain: "Heavy Rain",
  extreme_heat: "Extreme Heat",
  severe_pollution: "Severe Pollution",
  zone_shutdown: "Zone Shutdown",
  platform_outage: "Platform Outage",
};

const statusConfig = {
  auto_triggered: { icon: Clock, label: "Auto-Triggered", className: "border-blue-200 text-blue-600 bg-blue-500/10" },
  verifying: { icon: AlertTriangle, label: "Verifying", className: "border-amber-200 text-amber-600 bg-amber-500/10" },
  approved: { icon: CheckCircle, label: "Approved", className: "border-green-200 text-green-600 bg-green-500/10" },
  partial_payout: { icon: AlertTriangle, label: "Partial Payout", className: "border-amber-200 text-amber-600 bg-amber-500/10" },
  rejected: { icon: XCircle, label: "Rejected", className: "border-red-200 text-red-600 bg-red-500/10" },
};

export default function ClaimCard({ claim }) {
  const TypeIcon = typeIconMap[claim.disruption_type] || CloudRain;
  const statusConf = statusConfig[claim.status] || statusConfig.auto_triggered;
  const StatusIcon = statusConf.icon;
  const isAutoProcessed = claim.status === 'approved' || claim.status === 'auto_triggered' || claim.status === 'partial_payout';

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <TypeIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm">{typeLabelMap[claim.disruption_type]}</h4>
            <Badge variant="outline" className={statusConf.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConf.label}
            </Badge>
            {isAutoProcessed && (
              <Badge variant="outline" className="border-violet-200 text-violet-600 bg-violet-500/10 gap-1">
                <Bot className="w-3 h-3" />
                Auto-Processed
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {claim.zone} • {claim.shift_name || 'N/A'} • {claim.hours_lost || 0}h lost
          </p>
          {claim.disruption_details && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{claim.disruption_details}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-space font-bold text-lg">₹{claim.final_payout || 0}</p>
          <p className="text-xs text-muted-foreground">
            {claim.created_date ? new Date(claim.created_date).toLocaleDateString('en-IN') : ''}
          </p>
        </div>
      </div>

      {claim.fraud_score !== undefined && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-primary" />
            AI Fraud Score: {claim.fraud_score}/3
          </span>
          <span>•</span>
          <span>Rate: ₹{claim.hourly_rate || 0}/hr</span>
          <span>•</span>
          <span className="capitalize">{claim.plan_type || 'N/A'} plan</span>
        </div>
      )}
    </div>
  );
}