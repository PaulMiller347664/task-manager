import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { parseApiError } from '../utils/errors';
import ErrorAlert from '../components/common/ErrorAlert';
import { useSnackbar } from '../components/common/SnackbarProvider';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const { notify } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    register.mutate(
      { email, password },
      {
        onSuccess: () => {
          notify('Account created successfully.');
          navigate('/tasks', { replace: true });
        },
        onError: (err) => {
          const parsed = parseApiError(err);
          setError(parsed.message);
          setFieldErrors(parsed.fieldErrors);
        },
      },
    );
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign up to start managing your tasks.
          </Typography>

          <ErrorAlert message={error} />

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(fieldErrors.email)}
              helperText={fieldErrors.email}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(fieldErrors.password)}
              helperText={
                fieldErrors.password ?? 'At least 8 characters.'
              }
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={register.isPending}
            >
              {register.isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
