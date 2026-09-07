import { Storage } from "@/lib/storage";
import { getSubject } from "@/data/curriculum";
import type { ClassName, PlannerItem } from "@/types";

export function getPlan(): PlannerItem[] {
  return Storage.get("studyPlan", []);
}

export function savePlan(items: PlannerItem[]): PlannerItem[] {
  Storage.set("studyPlan", items);
  return items;
}

export function generatePlan(
  className: ClassName,
  subjects: string[],
  minutesPerDay: number,
  examDate: string | undefined,
  weak: string[]
): PlannerItem[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const out: PlannerItem[] = [];
  let index = 0;
  days.forEach((day, i) => {
    const subject = subjects[index++ % subjects.length] || "Mathematics";
    const meta = getSubject(subject, className);
    const topic = (meta?.topics || [])[i % (meta?.topics.length || 1)];
    out.push({
      day,
      time: "4:00 PM",
      subject,
      topic: topic?.title || "Revision",
      minutes: minutesPerDay,
      focus: weak.includes(subject) ? "Weak-area focus" : "Core practice",
      examDate,
    });
  });
  return savePlan(out);
}
