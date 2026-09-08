import React from "react";
import { Link } from "react-router-dom";
import { Users, ArrowLeft } from "lucide-react";

export default function UserManagement(){
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><Users/><h1 className="text-3xl font-bold">User Management</h1></div><p className="mt-2 text-white/50">Super Admin user-management workspace.</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><Box title="User Directory" text="A secure Supabase-backed user directory belongs here."/><Box title="Rank Assignment" text="Authorized administrators can assign approved ranks through secure backend policies."/><Box title="Account Status" text="Review account status and moderation information."/><Box title="User Search" text="Search and inspect permitted user records." /></div><Link to="/superadmin" className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16}/>Back</Link></main>;
}
function Box({title,text}:{title:string;text:string}){return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-white/50">{text}</p></div>}