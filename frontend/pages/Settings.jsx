import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const me = await base44.auth.me();
      setUser(me);
    }
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-space font-bold">Settings</h1>
        </div>
      </motion.div>

      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.full_name || 'Loading...'}</p>
            <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <span className="text-sm text-muted-foreground">Role</span>
            <span className="text-sm font-medium">{user?.role || 'user'}</span>
          </div>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full rounded-xl h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
        onClick={() => base44.auth.logout()}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}