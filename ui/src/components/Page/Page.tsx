import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { spacing } from '../DesignSystem/DesignSystem';

const Page = () => (
  <Container component={'main'} maxWidth={'lg'} sx={{ my: spacing }}>
    <Outlet />
  </Container>
);

export default Page;
