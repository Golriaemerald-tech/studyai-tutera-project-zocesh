import React from "react";
import { Link } from "react-router-dom";
import { Crown, Shield, BarChart3, Settings } from "lucide-react";

const items=[
["Security","Security and access oversight.","/owner/security",Shield],
["Analytics","Platform performance and activity.","/owner/analytics",BarChart3],
["Owner Settings","Owner-only platform configuration.","/owner/settings",Settings],
];

export default function OwnerDashboard(){
 return <main className="mx-auto max-w-6xl p-5 sm:p-8">
  <header className="mb-8"><div className="flex items-center gap-3"><Crown/><h1 className="text-3xl font-bold">Owner Dashboard</h1></div><p className="mt-2 text-white/50">Complete Zocesh Study AI ownership workspace.</p></header>
  <div className="grid gap-5 sm:grid-cols-3">{items.map(([title,text,to,Icon])=><Link key={String(to)} to={String(to)} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"><Icon size={25}/><h2 className="mt-4 font-semibold">{String(title)}</h2><p className="mt-2 text-sm text-white/50">{String(text)}</p></Link>)}</div>
  <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="font-semibold">Owner Access</h2><p className="mt-2 text-sm text-white/50">This page is restricted to the configured Owner account.</p></section>
 </main>;
}