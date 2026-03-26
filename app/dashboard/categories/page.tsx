import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CategoriesClient from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });

  return <CategoriesClient initialCategories={categories} />;
}
