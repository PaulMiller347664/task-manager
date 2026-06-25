import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type { Task } from '../../types/task';

interface Props {
  task: Task | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteTaskDialog({
  task,
  isPending,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog open={Boolean(task)} onClose={onCancel}>
      <DialogTitle>Delete task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete{' '}
          <strong>{task?.title}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
