import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await prisma.task.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { category: true },
  });

  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, status, priority, dueDate, categoryId, tags, isRecurring, recurringInterval } = body;

  const task = await prisma.task.updateMany({
    where: { id: params.id, userId: session.user.id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(tags !== undefined && { tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean).join(",") }),
      ...(isRecurring !== undefined && { isRecurring }),
      ...(recurringInterval !== undefined && { recurringInterval }),
    },
  });

  if (task.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.task.findUnique({ where: { id: params.id }, include: { category: true } });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.task.deleteMany({ where: { id: params.id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
