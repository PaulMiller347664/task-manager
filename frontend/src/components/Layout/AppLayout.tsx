import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';
import { getEmail } from '../../utils/auth';

export default function AppLayout() {
  const logout = useLogout();
  const navigate = useNavigate();
  const email = getEmail();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/tasks')}
          >
            Task Manager
          </Typography>
          {email && (
            <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
              {email}
            </Typography>
          )}
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
