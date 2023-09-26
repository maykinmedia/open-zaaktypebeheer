import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import Navigation from '../Navigation/Navigation';

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar component={'header'} position="sticky" color="transparent" elevation={0}>
      <Toolbar component={'section'}>
        <Button onClick={() => navigate('/')}>
          <Logo height={40} />
        </Button>
        <Box flexGrow={1} />
        <Navigation />
      </Toolbar>
    </AppBar>
  );
}
