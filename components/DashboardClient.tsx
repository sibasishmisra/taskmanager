"use client";
import { useState, useMemo } from "react";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { TaskWithCategory } from "@/types";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import StatsBar from "./StatsBar";
import { cn } from "@/lib/utils";

type View = "grid" | "list";
type FilterStatus = "ALL" | "TODO" | "IN_PROGRESS" | "DONE";

export default function DashboardClient({
  initialTasks,
  initialCategories,
}: {
  initialTasks: TaskWithCategory[];
  initialCategories: any[];
}) {
  const [tasks, setTasks] = useState<TaskWithCategory[]>(initialTasks);
  const [categories, setCategories] = useState(initialCategories);
  const [view, setView] = useState<View>("grid");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<TaskWithCategory | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
      if (filterPriority !== "ALL" && t.priority !== filterPriority) return false;
      if (filterCategory !== "ALL" && t.categoryId !== filterCategory) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.description?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tasks, filterStatus, filterPriority, filterCategory, search]);

  async function handleSave(data: any) {
    if (editTask) {
      const res = await fetch(`/api/tasks/${editTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === editTask.id ? updated : t));
    } else {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      setTasks(prev => [created, ...prev]);
    }
    setShowModal(false);
    setEditTask(null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  }

  function openEdit(task: TaskWithCategory) {
    setEditTask(task);
    setShowModal(true);
  }

  const statusTabs: { label: string; value: FilterStatus; color: string }[] = [
    { label: "All", value: "ALL", color: "text-slate-600" },
    { label: "To Do", value: "TODO", color: "text-slate-600" },
    { label: "In Progress", value: "IN_PROGRESS", color: "text-yellow-600" },
    { label: "Done", value: "DONE", color: "text-green-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Stats */}
      <StatsBar tasks={tasks} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
            <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-lg transition", view === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={cn("p-1.5 rounded-lg transition", view === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600")}>
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add task */}
          <button
            onClick={() => { setEditTask(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 w-fit">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
              filterStatus === tab.value
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            {tab.label}
            <span className={cn("ml-1.5 text-xs", filterStatus === tab.value ? "text-blue-200" : "text-slate-400")}>
              {tab.value === "ALL" ? tasks.length : tasks.filter(t => t.status === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task grid/list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Filter className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No tasks found</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or create a new task</p>
        </div>
      ) : (
        <div className={cn(
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "flex flex-col gap-3"
        )}>
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              view={view}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={editTask}
          categories={categories}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}
