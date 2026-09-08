import React from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Settings } from "lucide-react";

export default function SuperAdminDashboard(){
 const cards=[["User Management","Manage platform users and administration workflows.","/superadmin/users",Users],["Platform Control","Administration-level platform controls.","/superadmin/platform",Settings]];
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><Shield/><h1 className="text-3xl font-bold">Super Admin Dashboard</h1></div><p className="mt-2 text-white/50">High-level administration workspace.</p><div className="mt-7 grid gap-5 sm:grid-cols-2">{cards.map(([a,b,to,Icon])=><Link key={String(to)} to={String(to)} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"><Icon size={25}/><h2 className="mt-4 font-semibold">{String(a)}</h2><p className="mt-2 text-sm text-white/50">{String(b)}</p></Link>)}</div></main>;
}