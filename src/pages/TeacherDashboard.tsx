import React from "react";
import { BookOpen, Users, ClipboardList, BarChart3 } from "lucide-react";

export default function TeacherDashboard(){
 const cards=[["Classes","View teaching groups and assigned students.",Users],["Assignments","Create and review learning activities.",ClipboardList],["Resources","Organize teaching materials.",BookOpen],["Student Progress","Review permitted student learning progress.",BarChart3]];
 return <main className="mx-auto max-w-6xl p-5 sm:p-8"><div className="flex items-center gap-3"><BookOpen/><h1 className="text-3xl font-bold">Teacher Dashboard</h1></div><p className="mt-2 text-white/50">Teaching and student-support workspace.</p><div className="mt-7 grid gap-5 sm:grid-cols-2">{cards.map(([a,b,Icon])=><div key={String(a)} className="rounded-2xl border border-white/10 bg-white/5 p-6"><Icon size={25}/><h2 className="mt-4 font-semibold">{String(a)}</h2><p className="mt-2 text-sm text-white/50">{String(b)}</p></div>)}</div></main>;
}