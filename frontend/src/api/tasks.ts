import { api } from './axios';
import type {
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TaskStatusFilter,
  UpdateTaskInput,
} from '../types/task';
import { TaskStatus } from '../types/task';

export async function fetchTasks(
  page: number,
  pageSize: number,
  statusFilter: TaskStatusFilter = 'all',
  search = '',
): Promise<PaginatedTasks> {
  const { data } = await api.get<PaginatedTasks>('/tasks', {
    params: {
      page,
      pageSize,
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(search && { search }),
    },
  });
  return data;
}

export async function fetchTask(id: number): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${id}`);
  return data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', input);
  return data;
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const { data } = await api.put<Task>(`/tasks/${id}`, input);
  return data;
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus,
): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}/status`, { status });
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
