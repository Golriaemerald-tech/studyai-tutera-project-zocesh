import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

export default function AdminReports(){
 const reports=[["Account Reports","Account-related reports and moderation events."],["Study Reports","Study activity and issue reports."],["System Reports","Application and platform events."],["Audit Reports","Administrative audit information."]];
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><FileText/><h1 className="text-3xl font-bold">Admin Reports</h1></div><p className="mt-2 text-white/50">Reports available to authorized administrators.</p><div className="mt-7 grid gap-4 sm:grid-cols-2">{reports.map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm text-white/50">{b}</p></div>)}</div><Link to="/admin/dashboard" className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16}/>Back</Link></main>;
}