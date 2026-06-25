import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteTask,
  useTasks,
  useUpdateTaskStatus,
} from '../hooks/useTasks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { Task, TaskStatusFilter } from '../types/task';
import { TaskStatus } from '../types/task';
import TaskList from '../components/Tasks/TaskList';
import TaskPagination from '../components/Tasks/TaskPagination';
import TaskSearchField from '../components/Tasks/TaskSearchField';
import TaskStatusFilterControl, {
  taskStatusFilterLabel,
} from '../components/Tasks/TaskStatusFilter';
import DeleteTaskDialog from '../components/Tasks/DeleteTaskDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import { useSnackbar } from '../components/common/SnackbarProvider';
import { parseApiError } from '../utils/errors';

const PAGE_SIZE = 10;

export default function TaskListPage() {
  const navigate = useNavigate();
  const { notify } = useSnackbar();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const search = useDebouncedValue(searchInput, 300);
  const tasksQuery = useTasks(page, PAGE_SIZE, statusFilter, search);
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const handleToggleStatus = (task: Task) => {
    const nextStatus =
      task.status === TaskStatus.Complete
        ? TaskStatus.Incomplete
        : TaskStatus.Complete;

    updateStatus.mutate(
      { id: task.id, status: nextStatus },
      {
        onError: (err) => notify(parseApiError(err).message, 'error'),
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) {
      return;
    }
    deleteTask.mutate(taskToDelete.id, {
      onSuccess: () => {
        notify('Task deleted.');
        setTaskToDelete(null);
        // Step back a page if we just removed the last item on this page.
        if (tasksQuery.data?.items.length === 1 && page > 1) {
          setPage((p) => p - 1);
        }
      },
      onError: (err) => {
        notify(parseApiError(err).message, 'error');
        setTaskToDelete(null);
      },
    });
  };

  const data = tasksQuery.data;
  const busyStatusId = updateStatus.isPending
    ? updateStatus.variables?.id
    : null;
  const filteredLabel = taskStatusFilterLabel(statusFilter);
  const hasTasks = (data?.totalCount ?? 0) > 0;
  const hasActiveSearch = search.length > 0;

  const handleStatusFilterChange = (next: TaskStatusFilter) => {
    setStatusFilter(next);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  const emptyMessage = hasActiveSearch
    ? `No tasks matching "${search}"`
    : filteredLabel
      ? `No ${filteredLabel} tasks`
      : 'No tasks yet';

  const emptyHint = hasActiveSearch || filteredLabel
    ? 'Try a different search or filter, or create a new task.'
    : 'Create your first task to get started.';

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h4">My Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/tasks/new')}
        >
          New Task
        </Button>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <TaskSearchField
          value={searchInput}
          onChange={setSearchInput}
          disabled={tasksQuery.isFetching}
        />
      </Box>

      <Stack
        direction="row"
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="body2" color="text.secondary">
          Filter by status
        </Typography>
        <TaskStatusFilterControl
          value={statusFilter}
          onChange={handleStatusFilterChange}
          disabled={tasksQuery.isFetching}
        />
      </Stack>

      {tasksQuery.isError && (
        <ErrorAlert message={parseApiError(tasksQuery.error).message} />
      )}

      {tasksQuery.isLoading ? (
        <LoadingSpinner />
      ) : data && hasTasks ? (
        <>
          <TaskList
            tasks={data.items}
            onToggleStatus={handleToggleStatus}
            onEdit={(task) => navigate(`/tasks/${task.id}/edit`)}
            onDelete={(task) => setTaskToDelete(task)}
            busyTaskId={busyStatusId}
          />
          <TaskPagination
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={setPage}
            disabled={tasksQuery.isFetching}
          />
        </>
      ) : (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {emptyMessage}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {emptyHint}
          </Typography>
          {hasActiveSearch ? (
            <Button
              variant="outlined"
              onClick={() => setSearchInput('')}
              sx={{ mr: 1 }}
            >
              Clear search
            </Button>
          ) : null}
          {filteredLabel ? (
            <Button
              variant="outlined"
              onClick={() => handleStatusFilterChange('all')}
              sx={{ mr: 1 }}
            >
              Show all tasks
            </Button>
          ) : null}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tasks/new')}
          >
            New Task
          </Button>
        </Paper>
      )}

      <DeleteTaskDialog
        task={taskToDelete}
        isPending={deleteTask.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </Box>
  );
}
