import { useState, type FormEvent } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import type { CreateTaskInput } from '../../types/task';
import {
  localDateToUtcIso,
  utcIsoToLocalDateInput,
  validateDueDateInput,
} from '../../utils/dates';
import ErrorAlert from '../common/ErrorAlert';

interface Props {
  initialValues?: {
    title: string;
    description?: string | null;
    dueDate?: string | null;
  };
  submitLabel: string;
  isPending: boolean;
  error?: string | null;
  fieldErrors?: Record<string, string>;
  onSubmit: (input: CreateTaskInput) => void;
  onCancel: () => void;
}

export default function TaskForm({
  initialValues,
  submitLabel,
  isPending,
  error,
  fieldErrors = {},
  onSubmit,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [dueDate, setDueDate] = useState(
    utcIsoToLocalDateInput(initialValues?.dueDate),
  );
  const [localError, setLocalError] = useState<string | null>(null);
  const [localFieldErrors, setLocalFieldErrors] = useState<
    Record<string, string>
  >({});

  const mergedFieldErrors = { ...localFieldErrors, ...fieldErrors };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    setLocalFieldErrors({});

    if (!title.trim()) {
      setLocalError('Title is required.');
      return;
    }

    const dueDateError = validateDueDateInput(dueDate);
    if (dueDateError) {
      setLocalFieldErrors({ dueDate: dueDateError });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      dueDate: localDateToUtcIso(dueDate),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <ErrorAlert message={error ?? localError} />

      <Stack spacing={2}>
        <TextField
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={Boolean(mergedFieldErrors.title)}
          helperText={mergedFieldErrors.title}
          slotProps={{ htmlInput: { maxLength: 200 } }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={Boolean(mergedFieldErrors.description)}
          helperText={mergedFieldErrors.description}
        />
        <TextField
          label="Due date"
          type="date"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={Boolean(mergedFieldErrors.dueDate)}
          helperText={mergedFieldErrors.dueDate ?? 'Optional'}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
