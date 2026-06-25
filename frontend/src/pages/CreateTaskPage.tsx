import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCreateTask } from '../hooks/useTasks';
import TaskForm from '../components/Tasks/TaskForm';
import { useSnackbar } from '../components/common/SnackbarProvider';
import { parseApiError } from '../utils/errors';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const createTask = useCreateTask();
  const { notify } = useSnackbar();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          New Task
        </Typography>

        <TaskForm
          submitLabel="Create"
          isPending={createTask.isPending}
          error={error}
          fieldErrors={fieldErrors}
          onCancel={() => navigate('/tasks')}
          onSubmit={(input) => {
            setError(null);
            setFieldErrors({});
            createTask.mutate(input, {
              onSuccess: () => {
                notify('Task created.');
                navigate('/tasks');
              },
              onError: (err) => {
                const parsed = parseApiError(err);
                setError(parsed.message);
                setFieldErrors(parsed.fieldErrors);
              },
            });
          }}
        />
      </CardContent>
    </Card>
  );
}
