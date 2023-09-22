import { IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl } from '@mui/material/';
import SearchIcon from '@mui/icons-material/Search';
import { SearchProps } from '../../types/types';
import { outlinedInputStyling } from '../DesignSystem/DesignSystem';

export default function Search({ query, setQuery, label, fullWidth }: SearchProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  return (
    <FormControl variant="outlined" fullWidth sx={{ maxWidth: fullWidth ? '100%' : 320 }}>
      <InputLabel htmlFor="search" aria-label={label}>
        {label}
      </InputLabel>
      <OutlinedInput
        value={query}
        onChange={handleChange}
        sx={outlinedInputStyling}
        id="search"
        name="search"
        type="text"
        label={label}
        endAdornment={
          <InputAdornment position="start">
            <IconButton aria-label={label} edge="end" color="primary">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
}
