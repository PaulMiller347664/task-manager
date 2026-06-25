import { Box, Pagination, Typography } from '@mui/material';

interface Props {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function TaskPagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  disabled,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        mt: 3,
      }}
    >
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, nextPage) => onPageChange(nextPage)}
        disabled={disabled}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        aria-label="Task list pagination"
      />

      <Typography variant="body2" color="text.secondary">
        Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
      </Typography>
    </Box>
  );
}
