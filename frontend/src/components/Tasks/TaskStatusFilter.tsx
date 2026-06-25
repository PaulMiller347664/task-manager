import {
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import type { TaskStatusFilter } from '../../types/task';
import { TaskStatus } from '../../types/task';

interface Props {
  value: TaskStatusFilter;
  onChange: (value: TaskStatusFilter) => void;
  disabled?: boolean;
}

export default function TaskStatusFilterControl({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      disabled={disabled}
      onChange={(_, next) => {
        if (next !== null) {
          onChange(next as TaskStatusFilter);
        }
      }}
      aria-label="Filter tasks by status"
    >
      <ToggleButton value="all" aria-label="All tasks">
        All
      </ToggleButton>
      <ToggleButton value={TaskStatus.Incomplete} aria-label="Incomplete tasks">
        Incomplete
      </ToggleButton>
      <ToggleButton value={TaskStatus.Complete} aria-label="Complete tasks">
        Complete
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export function taskStatusFilterLabel(filter: TaskStatusFilter): string {
  switch (filter) {
    case TaskStatus.Complete:
      return 'complete';
    case TaskStatus.Incomplete:
      return 'incomplete';
    default:
      return '';
  }
}
