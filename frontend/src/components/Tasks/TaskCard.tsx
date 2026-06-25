import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Task } from '../../types/task';
import { TaskStatus } from '../../types/task';
import { formatLocalDateTime, isPastDate } from '../../utils/dates';

interface Props {
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  disabled?: boolean;
}

export default function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  disabled,
}: Props) {
  const isComplete = task.status === TaskStatus.Complete;
  const overdue = !isComplete && isPastDate(task.dueDate);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Checkbox
            checked={isComplete}
            onChange={() => onToggleStatus(task)}
            disabled={disabled}
            sx={{ mt: -0.5 }}
          />

          <Stack sx={{ flexGrow: 1, minWidth: 0 }} spacing={0.5}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: isComplete ? 'line-through' : 'none',
                color: isComplete ? 'text.disabled' : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {task.title}
            </Typography>

            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                {task.description}
              </Typography>
            )}

            <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
              <Chip
                size="small"
                label={isComplete ? 'Complete' : 'Incomplete'}
                color={isComplete ? 'success' : 'default'}
              />
              {task.dueDate && (
                <Chip
                  size="small"
                  variant="outlined"
                  color={overdue ? 'error' : 'default'}
                  label={`Due ${formatLocalDateTime(task.dueDate)}`}
                />
              )}
            </Stack>
          </Stack>

          <Stack direction="row">
            <Tooltip title="Edit">
              <span>
                <IconButton onClick={() => onEdit(task)} disabled={disabled}>
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span>
                <IconButton
                  onClick={() => onDelete(task)}
                  disabled={disabled}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
