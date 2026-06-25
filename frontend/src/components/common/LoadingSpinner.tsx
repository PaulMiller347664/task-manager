import { Box, CircularProgress } from '@mui/material';

interface Props {
  size?: number;
}

export default function LoadingSpinner({ size = 40 }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress size={size} />
    </Box>
  );
}
