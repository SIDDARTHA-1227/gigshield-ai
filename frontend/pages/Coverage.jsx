import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Shield, Clock, MapPin, CloudRain, Thermometer, Wind, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const defaultShifts = [
  { name: "Morning", start_time: "09:00", end_time: "12:00" },
  { name: "Lunch", start_time: "12:00", end_time: "15:00" },
  { name: "Dinner", start_time: "19:00", end_time: "22:00" },
];

export default function Coverage() {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "", phone: "", city: "", zone: "", platform: "Swiggy",
    avg_daily_earnings: 0, avg_hourly_earnings: 0, shifts: defaultShifts,
  });
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      const workers = await base44.entities.Worker.list('-created_date', 1);
      if (workers[0]) {
        setWorker(workers[0]);
        setForm({
          full_name: workers[0].full_name || "",
          phone: workers[0].phone || "",
          city: workers[0].city || "",
          zone: workers[0].zone || "",
          platform: workers[0].platform || "Swiggy",
          avg_daily_earnings: workers[0].avg_daily_earnings || 0,
          avg_hourly_earnings: workers[0].avg_hourly_earnings || 0,
          shifts: workers[0].shifts?.length ? workers[0].shifts : defaultShifts,
        });
      } else {
        setEditing(true);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (worker) {
      await base44.entities.Worker.update(worker.id, form);
      setWorker({ ...worker, ...form });
    } else {
      const created = await base44.entities.Worker.create(form);
      setWorker(created);
    }
    setEditing(false);
    toast({ title: "Profile saved!" });
  };

  const updateShift = (index, field, value) => {
    const updated = [...form.shifts];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, shifts: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const planConfig = {
    basic: { hours: 2, maxPayout: 300, price: 15 },
    standard: { hours: 4, maxPayout: 600, price: 25 },
    premium: { hours: 6, maxPayout: 1000, price: 35 },
  };
  const activePlan = worker?.active_plan && worker.active_plan !== 'none' ? planConfig[worker.active_plan] : null;

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-space font-bold">My Coverage</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, shifts, and coverage details</p>
      </motion.div>

      {/* Coverage Status */}
      {activePlan && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-space font-bold text-lg">
                {worker.active_plan.charAt(0).toUpperCase() + worker.active_plan.slice(1)} Plan Active
              </h3>
              <p className="text-sm text-muted-foreground">Since {worker.plan_start_date || 'N/A'}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-glow" />
              <span className="text-sm font-semibold text-green-600">Protected</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card/80 rounded-xl p-4 text-center">
              <p className="text-2xl font-space font-bold">{activePlan.hours}h</p>
              <p className="text-xs text-muted-foreground">Protected/week</p>
            </div>
            <div className="bg-card/80 rounded-xl p-4 text-center">
              <p className="text-2xl font-space font-bold">₹{activePlan.maxPayout}</p>
              <p className="text-xs text-muted-foreground">Max Payout/week</p>
            </div>
            <div className="bg-card/80 rounded-xl p-4 text-center">
              <p className="text-2xl font-space font-bold">₹{activePlan.price}</p>
              <p className="text-xs text-muted-foreground">Weekly Premium</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-space font-semibold">Worker Profile</h3>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Zone / Pincode</Label>
              <Input value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Delivery Platform</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Swiggy">Swiggy</SelectItem>
                  <SelectItem value="Zomato">Zomato</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Avg Daily Earnings (₹)</Label>
              <Input type="number" value={form.avg_daily_earnings} onChange={(e) => setForm({ ...form, avg_daily_earnings: Number(e.target.value) })} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>Avg Hourly Earnings (₹)</Label>
              <Input type="number" value={form.avg_hourly_earnings} onChange={(e) => setForm({ ...form, avg_hourly_earnings: Number(e.target.value) })} className="mt-1" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={handleSave} className="rounded-xl">Save Profile</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Name", value: worker?.full_name },
              { label: "Phone", value: worker?.phone },
              { label: "City", value: worker?.city },
              { label: "Zone", value: worker?.zone },
              { label: "Platform", value: worker?.platform },
              { label: "Avg Daily", value: `₹${worker?.avg_daily_earnings || 0}` },
              { label: "Avg Hourly", value: `₹${worker?.avg_hourly_earnings || 0}` },
              { label: "Risk Score", value: worker?.risk_score || 'N/A' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">{item.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shifts */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="font-space font-semibold mb-4">Working Shifts</h3>
        <div className="space-y-3">
          {(editing ? form.shifts : (worker?.shifts || defaultShifts)).map((shift, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              {editing ? (
                <>
                  <Input 
                    value={shift.name} 
                    onChange={(e) => updateShift(i, 'name', e.target.value)}
                    className="w-32" 
                    placeholder="Shift name"
                  />
                  <Input 
                    type="time" 
                    value={shift.start_time} 
                    onChange={(e) => updateShift(i, 'start_time', e.target.value)}
                    className="w-36"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input 
                    type="time" 
                    value={shift.end_time} 
                    onChange={(e) => updateShift(i, 'end_time', e.target.value)}
                    className="w-36"
                  />
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{shift.name} Shift</p>
                    <p className="text-xs text-muted-foreground">{shift.start_time} – {shift.end_time}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}