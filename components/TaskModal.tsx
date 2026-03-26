"use client";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { TaskWithCategory } from "@/types";
import { cn } from "@/lib/utils";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statuses = ["TODO", "IN_PROGRESS", "DONE"];
const recurringOptions = ["daily", "weekly", "monthly"];

export default function TaskModal({
  task,
  categories,
  onSave,
  onClose,
}: {
  task: TaskWithCategory | null;
  categories: any[];
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    categoryId: "",
    tags: "",
    isRecurring: false,
    recurringInterval: "weekly",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        categoryId: task.categoryId || "",
        tags: task.tags.join(", "),
        isRecurring: task.isRecurring,
        recurringInterval: task.recurringInterval || "weekly",
      });
    }
  }, [task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  const priorityColors: Record<string, string> = {
    LOW: "border-gray-300 bg-gray-50 text-gray-700",
    MEDIUM: "border-blue-300 bg-blue-50 text-blue-700",
    HIGH: "border-orange-300 bg-orange-50 text-orange-700",
    URGENT: "border-red-300 bg-red-50 text-red-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={cn(
                    "py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                    form.priority === p ? priorityColors[p] + " scale-105" : "border-slate-200 text-slate-500 hover:border-slate-300"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={cn(
                    "py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                    form.status === s
                      ? s === "DONE" ? "border-green-300 bg-green-50 text-green-700 scale-105"
                        : s === "IN_PROGRESS" ? "border-yellow-300 bg-yellow-50 text-yellow-700 scale-105"
                        : "border-slate-300 bg-slate-100 text-slate-700 scale-105"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  )}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Due date & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">No category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="work, urgent, design (comma separated)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-700">Recurring Task</p>
              <p className="text-xs text-slate-400 mt-0.5">Repeat this task automatically</p>
            </div>
            <div className="flex items-center gap-3">
              {form.isRecurring && (
                <select
                  value={form.recurringInterval}
                  onChange={e => setForm({ ...form, recurringInterval: e.target.value })}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {recurringOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
              <button
                type="button"
                onClick={() => setForm({ ...form, isRecurring: !form.isRecurring })}
                className={cn(
                  "w-11 h-6 rounded-full transition-all duration-200 relative",
                  form.isRecurring ? "bg-blue-600" : "bg-slate-300"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200",
                  form.isRecurring ? "left-5" : "left-0.5"
                )} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Saving..." : task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
