import { Box, IconButton, Button, Divider, SwipeableDrawer, styled } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '../Logo/Logo';
import List from '../List/List';
import { DrawerT } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/Auth';
import { getSiteTree } from '../../utils/siteTree';

const DrawerHeader = styled('section')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  justifyContent: 'space-between',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = ({ open, toggleDrawer }: DrawerT) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const siteTreeOptions = getSiteTree(navigate, auth);

  return (
    <SwipeableDrawer
      anchor={'right'}
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <Box
        sx={{ width: 240 }}
        component={'nav'}
        onKeyDown={toggleDrawer(false)}
        role="presentation"
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronRightIcon />
          </IconButton>
          <Button onClick={() => navigate('/')}>
            <Logo height={32} />
          </Button>
        </DrawerHeader>
        <Divider />
        <List siteTreeOptions={siteTreeOptions.slice(0, -1)} />
        <Divider />
        <List siteTreeOptions={siteTreeOptions.slice(-1)} />
      </Box>
    </SwipeableDrawer>
  );
};

export default Drawer;
