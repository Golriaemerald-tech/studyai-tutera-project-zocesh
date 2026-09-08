import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText } from "lucide-react";

export default function AdminDashboard(){
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><Shield/><h1 className="text-3xl font-bold">Admin Dashboard</h1></div><p className="mt-2 text-white/50">Administration workspace.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><Link to="/admin/reports" className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"><FileText size={25}/><h2 className="mt-4 font-semibold">Admin Reports</h2><p className="mt-2 text-sm text-white/50">Review administration reports and platform events.</p></Link><Box title="Moderation" text="Administration moderation workflows can be connected here." /></div></main>;
}
function Box({title,text}:{title:string;text:string}){return <div className="rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-white/50">{text}</p></div>}