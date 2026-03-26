import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      ...(status && { status: status as any }),
      ...(priority && { priority: priority as any }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    include: { category: true },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, status, priority, dueDate, categoryId, tags, isRecurring, recurringInterval } = body;

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "TODO",
      priority: priority || "MEDIUM",
      dueDate: dueDate ? new Date(dueDate) : null,
      categoryId: categoryId || null,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean).join(",") : "",
      isRecurring: isRecurring || false,
      recurringInterval: recurringInterval || null,
      userId: session.user.id,
    },
    include: { category: true },
  });

  return NextResponse.json(task, { status: 201 });
}
