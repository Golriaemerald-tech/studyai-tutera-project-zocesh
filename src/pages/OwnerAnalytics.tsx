import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, ArrowLeft } from "lucide-react";

export default function OwnerAnalytics(){
 const stats=[["Platform","Zocesh Study AI"],["Rank Areas","10"],["Curriculum","JSS1–SS3"],["Status","Active"]];
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><BarChart3/><h1 className="text-3xl font-bold">Owner Analytics</h1></div><p className="mt-2 text-white/50">Ownership-level platform overview.</p><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm text-white/50">{a}</p><p className="mt-2 text-lg font-semibold">{b}</p></div>)}</div><section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="font-semibold">Analytics Centre</h2><p className="mt-2 text-sm text-white/50">This is the dedicated Owner analytics page. Supabase-backed user, study, quiz and platform metrics can be connected here without exposing sensitive data to ordinary users.</p></section><Link to="/owner" className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16}/>Back</Link></main>;
}