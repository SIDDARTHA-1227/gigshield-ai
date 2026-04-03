import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Zap, Brain, CloudRain, CheckCircle, ArrowRight,
  TrendingUp, Clock, Bell, Bot, Star, ChevronRight
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Risk Engine",
    desc: "Real-time scoring across weather, order data, and idle time — weighted for maximum accuracy.",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: Zap,
    title: "Zero-Touch Claims",
    desc: "No forms. No waiting. When risk crosses the threshold, your payout triggers automatically.",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Pricing",
    desc: "Premiums adjust in real-time based on your zone risk — pay only for what you're exposed to.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: CloudRain,
    title: "Parametric Triggers",
    desc: "Heavy rain, extreme heat, platform outages — pre-defined triggers mean instant payouts.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Bell,
    title: "Live Risk Alerts",
    desc: "Get notified before disruptions happen so you can plan your shifts proactively.",
    color: "bg-red-500/10 text-red-600",
  },
  {
    icon: Bot,
    title: "Fraud-Resistant",
    desc: "AI fraud scoring on every claim ensures fairness and platform integrity.",
    color: "bg-pink-500/10 text-pink-600",
  },
];

const plans = [
  {
    name: "Basic",
    price: "₹20",
    period: "/week",
    desc: "Entry-level protection for new gig workers.",
    features: ["Up to ₹200 payout/day", "Rain & heat triggers", "Email alerts"],
    color: "border-border",
    badge: null,
  },
  {
    name: "Standard",
    price: "₹35",
    period: "/week",
    desc: "Best for full-time delivery partners.",
    features: ["Up to ₹500 payout/day", "All disruption triggers", "Live risk monitor", "Zero-touch claims"],
    color: "border-primary",
    badge: "Most Popular",
  },
  {
    name: "Premium",
    price: "₹60",
    period: "/week",
    desc: "Maximum coverage for power riders.",
    features: ["Up to ₹1000 payout/day", "All triggers + platform outage", "Priority payouts", "Dedicated AI model"],
    color: "border-amber-400",
    badge: "Best Value",
  },
];

const stats = [
  { value: "12,400+", label: "Gig Workers Protected" },
  { value: "₹48L+", label: "Payouts Disbursed" },
  { value: "< 90s", label: "Avg Claim Processing" },
  { value: "99.2%", label: "Claim Approval Rate" },
];

const steps = [
  { icon: Shield, title: "Pick a Plan", desc: "Choose coverage that fits your earnings." },
  { icon: Brain, title: "AI Monitors Live", desc: "The engine watches weather, orders & idle time." },
  { icon: Zap, title: "Disruption Detected", desc: "Risk score crosses 70 — claim auto-triggers." },
  { icon: CheckCircle, title: "Payout Sent", desc: "80% of lost income hits your account instantly." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-6 lg:px-16 py-4 flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
          </div>
          <span className="font-space font-bold text-lg">GigShield</span>
          <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full ml-1">AI</span>
        </div>
        <div className="hidden md:flex items-center gap-6 ml-10 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it Works</a>
          <a href="#plans" className="hover:text-foreground transition-colors">Plans</a>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link
            to="/"
            className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-16 pt-20 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> Powered by AI · Zero-Touch Claims
          </div>
          <h1 className="font-space font-bold text-5xl lg:text-7xl text-foreground leading-tight mb-6">
            Income Protection<br />
            <span className="text-primary">Built for Gig Workers</span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            GigShield AI monitors disruptions in real-time — rain, heat, platform outages — and automatically triggers your payout before you even file a claim.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/20 flex items-center gap-2 text-base"
            >
              Start Protecting Your Income <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how"
              className="text-muted-foreground font-medium px-6 py-4 rounded-2xl border border-border hover:bg-muted transition-colors text-base"
            >
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative max-w-4xl mx-auto mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="font-space font-bold text-2xl lg:text-3xl text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how" className="px-6 lg:px-16 py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space font-bold text-3xl lg:text-4xl mb-4">How GigShield Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Four steps. Fully automated. No paperwork ever.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 relative"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute top-5 right-5 font-space font-bold text-4xl text-muted/50">
                    0{i + 1}
                  </div>
                  <h3 className="font-space font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground z-10" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-16 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space font-bold text-3xl lg:text-4xl mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">A full AI insurance stack — designed for the gig economy.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-space font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="px-6 lg:px-16 py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space font-bold text-3xl lg:text-4xl mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">AI-adjusted weekly premiums. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card border-2 ${plan.color} rounded-2xl p-7 relative flex flex-col ${i === 1 ? "shadow-xl shadow-primary/10" : ""}`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full ${i === 1 ? "bg-primary text-primary-foreground" : "bg-amber-400 text-amber-900"}`}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="font-space font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="font-space font-bold text-4xl">{plan.price}</span>
                  <span className="text-muted-foreground mb-1">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${i === 1 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border hover:bg-muted"}`}
                >
                  Get {plan.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-primary via-violet-600 to-purple-700 rounded-3xl p-12 text-center text-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl mb-4">Your income deserves protection.</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Swiggy & Zomato delivery partners who never worry about disruptions again.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all text-base"
          >
            Start Free Today <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-16 py-10 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-space font-bold">GigShield AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 GigShield AI. Parametric income protection for gig workers.</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Trusted by 12,400+ riders</span>
          </div>
        </div>
      </footer>
    </div>
  );
}