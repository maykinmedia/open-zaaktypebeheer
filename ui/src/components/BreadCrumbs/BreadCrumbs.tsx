import { Link as RouterLink, useLocation } from 'react-router-dom';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { uuidExtract } from '../../utils/extract';
import { ucFirstText } from '../../utils/text';
import { NavigateNext } from '@mui/icons-material';
import { StyledRoutedLinkProps } from '../../types/types';

function StyledRoutedLink(props: StyledRoutedLinkProps) {
  return <Link {...props} component={RouterLink as any} />;
}

export default function BreadCrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return <></>;

  const modifiedNames = pathnames.map((pathname) => {
    if (uuidExtract(pathname) === null) {
      return ucFirstText(pathname);
    } else return uuidExtract(pathname)?.slice(0, 8);
  });

  return (
    <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext fontSize="small" />}>
      <StyledRoutedLink underline="hover" color="inherit" to="/">
        Dashboard
      </StyledRoutedLink>
      {modifiedNames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {value}
          </Typography>
        ) : (
          <StyledRoutedLink underline="hover" color="inherit" to={to} key={to}>
            {value}
          </StyledRoutedLink>
        );
      })}
    </Breadcrumbs>
  );
}
