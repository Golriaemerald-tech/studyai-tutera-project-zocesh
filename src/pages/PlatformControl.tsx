import React from "react";
import { Link } from "react-router-dom";
import { Settings, ArrowLeft } from "lucide-react";

export default function PlatformControl(){
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><Settings/><h1 className="text-3xl font-bold">Platform Control</h1></div><p className="mt-2 text-white/50">Super Admin platform-control centre.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><Box title="System Status" text="Monitor application services and platform health."/><Box title="Feature Controls" text="Manage controlled platform feature switches."/><Box title="Moderation" text="Review permitted moderation workflows."/><Box title="Maintenance" text="Prepare controlled maintenance operations." /></div><Link to="/superadmin" className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16}/>Back</Link></main>;
}
function Box({title,text}:{title:string;text:string}){return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-white/50">{text}</p></div>}