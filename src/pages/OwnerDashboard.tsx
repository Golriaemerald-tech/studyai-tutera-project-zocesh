import React from 'react';
import { Shield, Users, BarChart3, Settings, BookOpen, ClipboardList } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  'Owner Dashboard': Shield,
  'Owner Security': Shield,
  'Owner Analytics': BarChart3,
  'Owner Settings': Settings,
  'Super Admin Dashboard': Shield,
  'User Management': Users,
  'Platform Control': Settings,
  'Admin Dashboard': ClipboardList,
  'Admin Reports': BarChart3,
  'Teacher Dashboard': BookOpen,
};

export default function OwnerDashboard() {{
  const Icon = ICONS['Owner Dashboard'] || Shield;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-teal-500/10 p-3 text-teal-400">
              <Icon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
              <p className="mt-1 text-sm text-white/50">Owner-only platform overview and controls.</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5">
            <p className="text-sm text-white/70">
              This protected Zocesh Study AI page is part of version 1.1.6.
            </p>
            <p className="mt-2 text-xs text-white/40">
              Additional controls and data will be connected here as the platform expands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}}
