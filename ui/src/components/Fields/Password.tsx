import { FilledInput, FormControl, IconButton, InputAdornment, InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

const PasswordField = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="password" variant="filled">
        Wachtwoord
      </InputLabel>
      <FilledInput
        required
        autoComplete="current-password"
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default PasswordField;
