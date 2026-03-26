"use client";
import { CheckCircle2, Clock, AlertCircle, ListTodo } from "lucide-react";
import { TaskWithCategory } from "@/types";

export default function StatsBar({ tasks }: { tasks: TaskWithCategory[] }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "DONE").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const urgent = tasks.filter(t => t.priority === "URGENT" && t.status !== "DONE").length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE").length;

  const stats = [
    { label: "Total Tasks", value: total, icon: ListTodo, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Completed", value: done, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "In Progress", value: inProgress, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Overdue", value: overdue, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 card-hover">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
