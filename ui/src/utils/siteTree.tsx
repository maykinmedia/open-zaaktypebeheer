import { GetSiteTreeFunction } from '../types/types';
import { Outline } from '@maykin-ui/admin-ui/components';

export const getSiteTree: GetSiteTreeFunction = (navigate, auth) => [
  {
    label: 'Zaaktypen',
    Icon: <Outline.CubeTransparentIcon />,
    href: '/zaaktypen',
    onClick: () => navigate('/zaaktypen'),
  },
  // {
  //   label: 'Documenttypen',
  //   Icon: <Outline.PuzzlePieceIcon/>,
  //   href: '/documenttypen',
  //   onClick: () => navigate('/documenttypen'),
  // },
  {
    label: 'Admin',
    Icon: <Outline.ShieldCheckIcon />,
    href: '/admin',
    onClick: () => navigate('/admin'),
  },
  {
    label: 'Log uit',
    Icon: <Outline.ArrowRightOnRectangleIcon />,
    onClick: () => {
      auth.onSignOut();
    },
  },
];
