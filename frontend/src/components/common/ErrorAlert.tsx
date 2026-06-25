import { Alert, AlertTitle } from '@mui/material';

interface Props {
  message?: string | null;
  title?: string;
}

export default function ErrorAlert({ message, title = 'Error' }: Props) {
  if (!message) {
    return null;
  }
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
