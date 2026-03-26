import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return <DashboardClient initialTasks={tasks} initialCategories={categories} />;
}
