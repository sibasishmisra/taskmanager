"use client";
import { signOut } from "next-auth/react";
import { LogOut, Bell } from "lucide-react";

export default function TopBar({ user }: { user: any }) {
  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
      <div>
        <p className="text-sm text-slate-500">
          Good {getGreeting()},{" "}
          <span className="font-semibold text-slate-800">{user?.name?.split(" ")[0] || "there"}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition">
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
