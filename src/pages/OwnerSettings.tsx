import React from "react";
import { Link } from "react-router-dom";
import { Settings, ArrowLeft } from "lucide-react";

export default function OwnerSettings(){
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><Settings/><h1 className="text-3xl font-bold">Owner Settings</h1></div><p className="mt-2 text-white/50">Platform settings available only to the Owner.</p><div className="mt-7 space-y-4"><Box title="Platform Configuration" text="Owner-level configuration controls belong in this area."/><Box title="Rank Management" text="Trusted rank assignment and administration controls will be connected to secure Supabase authorization."/><Box title="Application Settings" text="Global Study AI settings can be managed here." /></div><Link to="/owner" className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16}/>Back</Link></main>;
}
function Box({title,text}:{title:string;text:string}){return <section className="rounded-2xl border border-white/10 bg-white/5 p-6"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-white/50">{text}</p></section>}