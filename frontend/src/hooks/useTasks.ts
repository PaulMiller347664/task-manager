import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createTask,
  deleteTask,
  fetchTask,
  fetchTasks,
  updateTask,
  updateTaskStatus,
} from '../api/tasks';
import type {
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TaskStatusFilter,
  UpdateTaskInput,
} from '../types/task';
import { TaskStatus } from '../types/task';

export const taskKeys = {
  all: ['tasks'] as const,
  list: (
    page: number,
    pageSize: number,
    statusFilter: TaskStatusFilter,
    search: string,
  ) => ['tasks', { page, pageSize, statusFilter, search }] as const,
  detail: (id: number) => ['tasks', 'detail', id] as const,
};

export function useTasks(
  page: number,
  pageSize: number,
  statusFilter: TaskStatusFilter = 'all',
  search = '',
) {
  const normalizedSearch = search.trim();

  return useQuery<PaginatedTasks>({
    queryKey: taskKeys.list(page, pageSize, statusFilter, normalizedSearch),
    queryFn: () => fetchTasks(page, pageSize, statusFilter, normalizedSearch),
    placeholderData: (previous) => previous,
  });
}

export function useTask(id: number) {
  return useQuery<Task>({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchTask(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation<Task, unknown, CreateTaskInput>({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useUpdateTask(id: number) {
  const queryClient = useQueryClient();
  return useMutation<Task, unknown, UpdateTaskInput>({
    mutationFn: (input) => updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation<Task, unknown, { id: number; status: TaskStatus }>({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: (id) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
