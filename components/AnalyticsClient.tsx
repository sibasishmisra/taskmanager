"use client";
import { TaskWithCategory } from "@/types";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsClient({ tasks }: { tasks: TaskWithCategory[] }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "DONE").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const todo = tasks.filter(t => t.status === "TODO").length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const byPriority = ["URGENT", "HIGH", "MEDIUM", "LOW"].map(p => ({
    label: p,
    count: tasks.filter(t => t.priority === p).length,
    done: tasks.filter(t => t.priority === p && t.status === "DONE").length,
  }));

  const priorityColors: Record<string, string> = {
    URGENT: "bg-red-500",
    HIGH: "bg-orange-400",
    MEDIUM: "bg-blue-400",
    LOW: "bg-slate-300",
  };

  // Category breakdown
  const categoryMap: Record<string, { name: string; color: string; count: number; done: number }> = {};
  tasks.forEach(t => {
    const key = t.categoryId || "__none__";
    const name = t.category?.name || "Uncategorized";
    const color = t.category?.color || "#94a3b8";
    if (!categoryMap[key]) categoryMap[key] = { name, color, count: 0, done: 0 };
    categoryMap[key].count++;
    if (t.status === "DONE") categoryMap[key].done++;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your task performance</p>
      </div>

      {/* Completion ring + stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion rate */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#3b82f6" strokeWidth="10"
                strokeDasharray={`${completionRate * 2.51} 251`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{completionRate}%</span>
              <span className="text-xs text-slate-400">done</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-700 mt-3">Completion Rate</p>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 md:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Status Breakdown</p>
          {[
            { label: "To Do", count: todo, color: "bg-slate-400", icon: Clock },
            { label: "In Progress", count: inProgress, color: "bg-yellow-400", icon: TrendingUp },
            { label: "Done", count: done, color: "bg-green-500", icon: CheckCircle2 },
          ].map(({ label, count, color, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{label}</span>
                  <span className="text-slate-400">{count} / {total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", color)}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-sm font-semibold text-slate-700 mb-4">Tasks by Priority</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {byPriority.map(({ label, count, done }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4 text-center">
              <div className={cn("w-2 h-2 rounded-full mx-auto mb-2", priorityColors[label])} />
              <p className="text-xl font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              <p className="text-xs text-green-600 mt-1">{done} done</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(categoryMap).length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Tasks by Category</p>
          <div className="space-y-3">
            {Object.values(categoryMap).map(({ name, color, count, done }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{name}</span>
                    <span className="text-slate-400">{done}/{count} done</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(count / total) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
