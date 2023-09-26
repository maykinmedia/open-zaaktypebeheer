import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Stack, useMediaQuery, Button } from '@mui/material';
import { useAuth } from '../Auth/Auth';
import { getSiteTree } from '../../utils/siteTree';
import Drawer from '../Drawer/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { ToggleDrawerFunction } from '../../types/types';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const mobileDevice = useMediaQuery('(max-width:768px)');
  const auth = useAuth();
  const navigate = useNavigate();
  const siteTreeOptions = getSiteTree(navigate, auth);

  const toggleDrawer: ToggleDrawerFunction = (newState) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(newState);
  };

  if (mobileDevice)
    return (
      <>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Drawer open={open} toggleDrawer={toggleDrawer} />
      </>
    );

  return (
    <Stack component={'nav'} direction="row" spacing={2}>
      {siteTreeOptions.map((option, index, array) => (
        <Button
          key={option.label}
          size="large"
          sx={{ textTransform: 'none' }}
          startIcon={option.Icon}
          variant={index + 1 === array.length ? 'contained' : 'text'}
          onClick={option.onClick}
        >
          {option.label}
        </Button>
      ))}
    </Stack>
  );
};

export default Navigation;
