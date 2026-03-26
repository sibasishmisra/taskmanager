import { Task, Category } from "@prisma/client";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskWithCategory = Task & {
  category: Category | null;
};

export type { Task, Category };

export interface TaskFormData {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  categoryId?: string;
  tags?: string;
  isRecurring?: boolean;
  recurringInterval?: string;
}
