import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TaskSearchField({ value, onChange, disabled }: Props) {
  return (
    <TextField
      fullWidth
      size="small"
      label="Search tasks"
      placeholder="Search by id, title, or description"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
