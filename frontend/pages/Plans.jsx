import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PlanCard from "../components/plans/PlanCard";
import { motion } from "framer-motion";
import { Shield, Info, Brain, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function Plans() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const workers = await base44.entities.Worker.list('-created_date', 1);
      setWorker(workers[0] || null);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!loading) fetchDynamicPricing();
  }, [loading]);

  const fetchDynamicPricing = async () => {
    setPricingLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an AI risk pricing engine for GigShield AI, an income protection platform for gig delivery workers.

Worker profile: City: ${worker?.city || 'Guntur'}, Zone: ${worker?.zone || '522001'}, Platform: ${worker?.platform || 'Swiggy'}, Avg hourly earnings: ₹${worker?.avg_hourly_earnings || 120}, Current risk score: ${worker?.risk_score || 'medium'}.

Current date: March 2026. Season: Late summer/pre-monsoon in Andhra Pradesh.

Based on:
1. Zone risk (historical disruptions, monsoon season approaching)
2. Worker activity patterns
3. Environmental conditions typical for this region

Output a risk assessment with dynamic pricing adjustment:`,
      response_json_schema: {
        type: "object",
        properties: {
          risk_level: { type: "string", enum: ["low", "medium", "high"] },
          risk_score_percent: { type: "number" },
          reasoning: { type: "string" },
          pricing_note: { type: "string" },
          disruption_probability_next_week: { type: "number" }
        }
      }
    });
    setPricing(result);
    setPricingLoading(false);
  };

  const handleSelect = async (planKey) => {
    if (!worker) {
      toast({ title: "Please complete registration first", variant: "destructive" });
      return;
    }
    await base44.entities.Worker.update(worker.id, {
      active_plan: planKey,
      plan_start_date: new Date().toISOString().split('T')[0],
      risk_score: pricing?.risk_level || worker.risk_score,
    });
    setWorker({ ...worker, active_plan: planKey, plan_start_date: new Date().toISOString().split('T')[0] });
    toast({ title: `${planKey.charAt(0).toUpperCase() + planKey.slice(1)} plan activated!` });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const riskScore = pricing?.risk_level || worker?.risk_score || "medium";
  const riskPercent = pricing?.risk_score_percent ?? (riskScore === 'high' ? 72 : riskScore === 'medium' ? 45 : 18);

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-space font-bold">Weekly Protection Plans</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Choose a plan that matches your working hours. Pricing adjusts in real-time based on your zone risk.
        </p>
      </motion.div>

      {/* AI Risk & Dynamic Pricing Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/5 via-violet-500/5 to-primary/5 border border-primary/20 rounded-2xl p-5 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-space font-semibold">AI Dynamic Pricing</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Live</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDynamicPricing}
            disabled={pricingLoading}
            className="text-primary hover:bg-primary/10 text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pricingLoading ? 'animate-spin' : ''}`} />
            {pricingLoading ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>

        {pricingLoading ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            AI is calculating zone risk and adjusting prices...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card/80 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">AI Risk Score</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-space font-bold ${
                  riskScore === 'high' ? 'text-red-600' :
                  riskScore === 'medium' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {riskPercent}%
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  riskScore === 'high' ? 'bg-red-500/10 text-red-600' :
                  riskScore === 'medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'
                }`}>
                  {riskScore.charAt(0).toUpperCase() + riskScore.slice(1)} Risk
                </span>
              </div>
            </div>
            <div className="bg-card/80 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Disruption Probability</p>
              <p className="text-2xl font-space font-bold">{pricing?.disruption_probability_next_week ?? 45}%</p>
              <p className="text-xs text-muted-foreground">next 7 days</p>
            </div>
            <div className="bg-card/80 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Price Range</p>
              <p className="text-2xl font-space font-bold">₹20–₹60</p>
              <p className="text-xs text-muted-foreground">per week</p>
            </div>
          </div>
        )}

        {pricing?.reasoning && !pricingLoading && (
          <p className="mt-3 text-xs text-muted-foreground border-t border-border/50 pt-3">
            <span className="font-medium text-foreground">AI insight: </span>{pricing.reasoning}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <PlanCard planKey="basic" currentPlan={worker?.active_plan} onSelect={handleSelect} delay={0} riskScore={riskScore} />
        <PlanCard planKey="standard" currentPlan={worker?.active_plan} onSelect={handleSelect} delay={0.1} riskScore={riskScore} />
        <PlanCard planKey="premium" currentPlan={worker?.active_plan} onSelect={handleSelect} delay={0.2} riskScore={riskScore} />
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h3 className="font-space font-semibold">How AI Dynamic Pricing Works</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <p><span className="font-medium text-foreground">Base Price</span> — Your plan's standard weekly cost</p>
            <p><span className="font-medium text-foreground">AI Adjustment</span> — +/- based on zone risk, season, history</p>
            <p><span className="font-medium text-foreground">Final Price</span> — Fair pricing reflecting your actual risk exposure</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4 space-y-1.5 text-xs">
            <p className="font-medium text-foreground text-sm mb-2">Risk Factors Analyzed:</p>
            <p>🌧 Historical rainfall frequency in zone</p>
            <p>🌡 Temperature extremes & heat waves</p>
            <p>💨 AQI patterns & pollution data</p>
            <p>📅 Seasonal trends & monsoon proximity</p>
            <p>📊 Past claim frequency in your zone</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}