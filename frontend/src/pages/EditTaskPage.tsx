import { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTask, useUpdateTask } from '../hooks/useTasks';
import TaskForm from '../components/Tasks/TaskForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import { useSnackbar } from '../components/common/SnackbarProvider';
import { parseApiError } from '../utils/errors';

export default function EditTaskPage() {
  const navigate = useNavigate();
  const { notify } = useSnackbar();
  const { id } = useParams();
  const taskId = Number(id);

  const taskQuery = useTask(taskId);
  const updateTask = useUpdateTask(taskId);

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  return (
    <Card elevation={2}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Task
        </Typography>

        {taskQuery.isLoading ? (
          <LoadingSpinner />
        ) : taskQuery.isError ? (
          <ErrorAlert
            message={parseApiError(taskQuery.error).message}
            title="Could not load task"
          />
        ) : taskQuery.data ? (
          <TaskForm
            initialValues={{
              title: taskQuery.data.title,
              description: taskQuery.data.description,
              dueDate: taskQuery.data.dueDate,
            }}
            submitLabel="Save changes"
            isPending={updateTask.isPending}
            error={error}
            fieldErrors={fieldErrors}
            onCancel={() => navigate('/tasks')}
            onSubmit={(input) => {
              setError(null);
              setFieldErrors({});
              updateTask.mutate(input, {
                onSuccess: () => {
                  notify('Task updated.');
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
        ) : null}
      </CardContent>
    </Card>
  );
}
