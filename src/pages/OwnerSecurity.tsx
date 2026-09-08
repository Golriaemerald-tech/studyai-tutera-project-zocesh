import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function OwnerSecurity(){
 return <Page title="Owner Security" icon={<Shield/>} subtitle="Security controls reserved for the Owner.">
  <Grid items={[
   ["Access Protection","Review protected rank areas and authorization controls."],
   ["Role Security","Owner and administration privileges must be assigned through trusted controls."],
   ["Account Protection","Review authentication and account-security configuration."],
   ["Audit Controls","Future security events and administrative audit logs can be managed here."]
  ]}/><Back/>
 </Page>;
}
function Grid({items}:{items:string[][]}){return <div className="grid gap-4 sm:grid-cols-2">{items.map(([a,b])=><div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{a}</h2><p className="mt-2 text-sm text-white/50">{b}</p></div>)}</div>}
function Page({title,icon,subtitle,children}:{title:string;icon:React.ReactNode;subtitle:string;children:React.ReactNode}){return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3">{icon}<h1 className="text-3xl font-bold">{title}</h1></div><p className="mt-2 mb-7 text-white/50">{subtitle}</p>{children}</main>}
function Back(){return <Link to="/owner" className="mt-7 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft size={16}/>Back to Owner Dashboard</Link>}