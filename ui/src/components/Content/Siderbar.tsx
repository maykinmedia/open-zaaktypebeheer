import { ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { currentMargin, headerHeight, spacings, tabsHeight } from '../DesignSystem/DesignSystem';
import { widthText } from '../../utils/text';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { memo } from 'react';
import { HashLink } from 'react-router-hash-link';
import { ContentStructure } from '../../types/types';

interface ContentSidebarProps {
  loading: boolean;
  scrolledIndex: number;
  contentStructure: ContentStructure;
}

// Fix this to be generic and not hardcoded
const scrollMargin = headerHeight + currentMargin + tabsHeight;

const ContentSidebar = ({ loading, scrolledIndex, contentStructure }: ContentSidebarProps) => {
  return (
    <Stack
      component={'aside'}
      spacing={spacings.small}
      position={'sticky'}
      top={scrollMargin}
      height={'fit-content'}
    >
      <Typography variant="h3" component="h2">
        {loading ? <Skeleton width={widthText('In dit zaaktype:', 6.5)} /> : 'In dit zaaktype:'}
      </Typography>
      <nav aria-label="Zaaktype sidebar">
        <List disablePadding>
          {contentStructure?.map((row: any, i: number) => {
            return (
              <ListItem key={i} disablePadding sx={{ borderLeft: 1, borderColor: 'divider' }}>
                <ListItemButton
                  component={HashLink}
                  smooth
                  to={loading ? '' : '#' + row.slug}
                  selected={loading ? false : scrolledIndex === i}
                >
                  <ListItemText>
                    {loading ? <Skeleton key={i} width={widthText(row.label, 6.5)} /> : row.label}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </nav>
    </Stack>
  );
};

export default memo(ContentSidebar);
