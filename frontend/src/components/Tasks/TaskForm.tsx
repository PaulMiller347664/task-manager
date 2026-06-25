import { useState, type FormEvent } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import type { CreateTaskInput } from '../../types/task';
import {
  localDateAndTimeToUtcIso,
  utcIsoToLocalDateInput,
  utcIsoToLocalTimeInput,
  validateDueDateParts,
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
  const [dueTime, setDueTime] = useState(
    utcIsoToLocalTimeInput(initialValues?.dueDate),
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

    const dueDateError = validateDueDateParts(dueDate, dueTime);
    if (dueDateError) {
      setLocalFieldErrors({ dueDate: dueDateError });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() ? description.trim() : null,
      dueDate: localDateAndTimeToUtcIso(dueDate, dueTime),
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
        <Stack spacing={2}>
          <TextField
            label="Due date"
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={Boolean(mergedFieldErrors.dueDate)}
            helperText={
              mergedFieldErrors.dueDate ??
              'Optional. Required if you set a time.'
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Due time"
            type="time"
            fullWidth
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            error={Boolean(mergedFieldErrors.dueTime)}
            helperText={
              mergedFieldErrors.dueTime ??
              'Optional. Defaults to 11:59 PM if date only.'
            }
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>

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
