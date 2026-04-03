import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { FileText, Filter, Bot, Zap, ShieldCheck } from "lucide-react";
import ClaimCard from "../components/claims/ClaimCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await base44.entities.Claim.list('-created_date', 50);
      setClaims(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = statusFilter === "all"
    ? claims
    : claims.filter(c => c.status === statusFilter);

  const totalPayout = claims
    .filter(c => c.status === 'approved' || c.status === 'partial_payout')
    .reduce((sum, c) => sum + (c.final_payout || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-space font-bold">Claims History</h1>
        </div>
        <p className="text-muted-foreground">
          All claims are auto-triggered when disruptions are detected during your shifts.
        </p>
      </motion.div>

      {/* Zero-Touch Claims Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-primary rounded-2xl p-5 mb-8 text-white"
      >
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-space font-bold text-lg">Zero-Touch Claims</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">AI Powered</span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed">
              No forms. No waiting. Claims are automatically processed using AI triggers — the moment a disruption is detected in your zone during your shift, a claim is initiated on your behalf.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Instant Detection", "AI Verification", "Auto Payout", "Fraud-Safe"].map((tag) => (
                <span key={tag} className="text-xs bg-white/15 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -right-2 bottom-0 w-24 h-24 rounded-full bg-white/5" />
      </motion.div>

      {/* How Claims Work */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: Zap, label: "Disruption Detected", desc: "AI monitors weather, AQI, zone alerts 24/7" },
          { icon: ShieldCheck, label: "Fraud Check", desc: "Location & activity validated in seconds" },
          { icon: Bot, label: "Auto Payout", desc: "Compensation deposited without any action from you" },
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="bg-card rounded-xl border border-border p-4 flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <step.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold">{step.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-space font-bold text-foreground">{claims.length}</p>
          <p className="text-sm text-muted-foreground">Total Claims</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-space font-bold text-green-600">
            {claims.filter(c => c.status === 'approved').length}
          </p>
          <p className="text-sm text-muted-foreground">Approved</p>
        </div>
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <p className="text-3xl font-space font-bold text-primary">₹{totalPayout}</p>
          <p className="text-sm text-muted-foreground">Total Payouts</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Claims</SelectItem>
            <SelectItem value="auto_triggered">Auto-Triggered</SelectItem>
            <SelectItem value="verifying">Verifying</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="partial_payout">Partial Payout</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Claims List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No claims found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Claims will appear here when disruptions are detected</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((claim, i) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ClaimCard claim={claim} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}