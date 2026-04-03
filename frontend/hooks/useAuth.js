import { motion } from "framer-motion";
import { Check, Zap, Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const basePlanData = {
  basic: {
    name: "Basic",
    basePrice: 15,
    hours: 2,
    maxPayout: 300,
    features: [
      "2 protected hours/week",
      "Up to ₹300 weekly payout",
      "Auto-triggered claims",
      "Basic fraud protection",
    ],
  },
  standard: {
    name: "Standard",
    basePrice: 25,
    hours: 4,
    maxPayout: 600,
    popular: true,
    features: [
      "4 protected hours/week",
      "Up to ₹600 weekly payout",
      "Auto-triggered claims",
      "Advanced fraud protection",
      "Predictive risk alerts",
    ],
  },
  premium: {
    name: "Premium",
    basePrice: 35,
    hours: 6,
    maxPayout: 1000,
    features: [
      "6 protected hours/week",
      "Up to ₹1,000 weekly payout",
      "Auto-triggered claims",
      "Advanced fraud protection",
      "Predictive risk alerts",
      "Priority payouts",
      "Platform outage coverage",
    ],
  },
};

// AI dynamic pricing multiplier based on risk level
const riskMultiplier = { low: 0.85, medium: 1.0, high: 1.35 };
const riskRange = { low: [0.8, 0.95], medium: [0.95, 1.1], high: [1.2, 1.5] };

export default function PlanCard({ planKey, currentPlan, onSelect, delay = 0, riskScore = "medium" }) {
  const plan = basePlanData[planKey];
  const isActive = currentPlan === planKey;

  const multiplier = riskMultiplier[riskScore] || 1.0;
  const dynamicPrice = Math.round(plan.basePrice * multiplier);
  const [minM, maxM] = riskRange[riskScore] || riskRange.medium;
  const minPrice = Math.round(plan.basePrice * minM);
  const maxPrice = Math.round(plan.basePrice * maxM);
  const priceChanged = dynamicPrice !== plan.basePrice;
  const priceUp = dynamicPrice > plan.basePrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative bg-card rounded-2xl border overflow-hidden
        ${isActive ? 'border-primary shadow-xl shadow-primary/10' : 'border-border hover:border-primary/30'}
        transition-all duration-300
      `}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-primary to-violet-600 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl">
            Most Popular
          </div>
        </div>
      )}

      <div className="p-6">
        {/* AI Dynamic Pricing Badge */}
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-space font-bold text-lg">{plan.name}</h3>
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] px-1.5 py-0 gap-1">
            <Brain className="w-2.5 h-2.5" /> AI Pricing
          </Badge>
        </div>

        {/* Dynamic Price Display */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-space font-bold">₹{dynamicPrice}</span>
          <span className="text-sm text-muted-foreground">/week</span>
          {priceChanged && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${priceUp ? 'text-red-500' : 'text-green-600'}`}>
              {priceUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {priceUp ? `+₹${dynamicPrice - plan.basePrice}` : `-₹${plan.basePrice - dynamicPrice}`}
            </span>
          )}
        </div>

        {/* Price range and risk note */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">₹{minPrice}–₹{maxPrice}/week based on zone risk</span>
        </div>

        {/* Risk pill */}
        <div className={`mt-3 inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
          riskScore === 'high' ? 'bg-red-500/10 text-red-600' :
          riskScore === 'medium' ? 'bg-amber-500/10 text-amber-600' :
          'bg-green-500/10 text-green-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            riskScore === 'high' ? 'bg-red-500' :
            riskScore === 'medium' ? 'bg-amber-500' : 'bg-green-500'
          }`} />
          Zone Risk: {riskScore.charAt(0).toUpperCase() + riskScore.slice(1)}
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          {plan.hours} protected hours • Up to ₹{plan.maxPayout.toLocaleString()} payout
        </p>

        <div className="mt-5 space-y-3">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-foreground/80">{f}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => onSelect(planKey)}
          className={`w-full mt-8 h-12 rounded-xl font-semibold ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
          } transition-all duration-300`}
        >
          {isActive ? (
            <><Zap className="w-4 h-4 mr-2" /> Active Plan</>
          ) : (
            'Select Plan'
          )}
        </Button>
      </div>
    </motion.div>
  );
}