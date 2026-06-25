export enum TaskStatus {
  Incomplete = 0,
  Complete = 1,
}

export type TaskStatusFilter = 'all' | TaskStatus;

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  status: TaskStatus;
  createdAt: string;
}

export interface PaginatedTasks {
  items: Task[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

export type UpdateTaskInput = CreateTaskInput;
