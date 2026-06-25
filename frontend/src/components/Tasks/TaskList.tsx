import { Stack } from '@mui/material';
import type { Task } from '../../types/task';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  busyTaskId?: number | null;
}

export default function TaskList({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  busyTaskId,
}: Props) {
  return (
    <Stack spacing={2}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={busyTaskId === task.id}
        />
      ))}
    </Stack>
  );
}
