"use client";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Tag, MoreVertical, Pencil, Trash2, RefreshCw, CheckCircle2, Circle, Clock } from "lucide-react";
import { TaskWithCategory } from "@/types";
import { cn, priorityColors, statusColors } from "@/lib/utils";

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  DONE: CheckCircle2,
};

const statusNext: Record<string, string> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};

export default function TaskCard({
  task,
  view,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: TaskWithCategory;
  view: "grid" | "list";
  onEdit: (t: TaskWithCategory) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const StatusIcon = statusIcons[task.status as keyof typeof statusIcons];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE";

  async function cycleStatus() {
    setLoading(true);
    await onStatusChange(task.id, statusNext[task.status]);
    setLoading(false);
  }

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-slate-100 p-4 card-hover animate-fade-in group relative",
      task.status === "DONE" && "opacity-70",
      view === "list" && "flex items-start gap-4"
    )}>
      {/* Status toggle */}
      <button
        onClick={cycleStatus}
        disabled={loading}
        className={cn(
          "shrink-0 transition-all duration-200",
          view === "list" ? "mt-0.5" : "mb-3 block"
        )}
        title={`Mark as ${statusNext[task.status].replace("_", " ")}`}
      >
        <StatusIcon className={cn(
          "w-5 h-5 transition",
          task.status === "DONE" ? "text-green-500" :
          task.status === "IN_PROGRESS" ? "text-yellow-500" :
          "text-slate-300 hover:text-blue-400"
        )} />
      </button>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            "font-semibold text-slate-800 text-sm leading-snug",
            task.status === "DONE" && "line-through text-slate-400"
          )}>
            {task.title}
          </h3>
          {/* Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/60 z-10 py-1 w-36 animate-scale-in">
                <button
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", priorityColors[task.priority as keyof typeof priorityColors])}>
            {task.priority}
          </span>
          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColors[task.status as keyof typeof statusColors])}>
            {task.status.replace("_", " ")}
          </span>
          {task.category && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.category.color }} />
              {task.category.name}
            </span>
          )}
          {task.isRecurring && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5" /> Recurring
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          {task.dueDate ? (
            <span className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-500 font-medium" : "text-slate-400"
            )}>
              <Calendar className="w-3 h-3" />
              {isOverdue ? "Overdue · " : ""}
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          ) : <span />}

          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-slate-300" />
              <span className="text-xs text-slate-400">{task.tags.split(",").slice(0, 2).join(", ")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
