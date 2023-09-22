import { Card as CardComponent, CardContent, Skeleton } from '@mui/material/';
import Typography from '@mui/material/Typography';
import { CardActionArea, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mediaQueries } from '../DesignSystem/DesignSystem';
import { CardProps } from '../../types/types';

export default function Card({ loading, title = '', description = '', detailUrl = '' }: CardProps) {
  const mobileScreen = useMediaQuery(mediaQueries.mobile);
  const navigate = useNavigate();

  const handleClick = () => {
    detailUrl && navigate(detailUrl);
  };

  return (
    <CardComponent
      variant="outlined"
      sx={{
        width: {
          xs: mobileScreen ? '100%' : 'calc(100% / 2 - 16px * 1 / 2)',
          sm: 'calc(100% / 2 - 16px * 1 / 2)',
          md: 'calc(100% / 3 - 24px * 2 / 3)',
          lg: 'calc(100% / 4 - 24px * 3 / 4)',
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ borderRadius: '0' }}>
        <CardContent component={'article'}>
          <Typography gutterBottom variant="body1" component="h3" noWrap>
            {loading ? <Skeleton variant="text" /> : title}
          </Typography>
          <Typography variant="body2">
            {loading ? <Skeleton variant="text" width={140} /> : description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </CardComponent>
  );
}
