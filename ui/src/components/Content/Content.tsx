import { useRef, useMemo } from 'react';
import { Box, Divider, Stack, useMediaQuery } from '@mui/material';
import {
  currentMargin,
  headerHeight,
  mediaQueries,
  spacings,
  tabsHeight,
} from '../DesignSystem/DesignSystem';
import useObserver from '../../hooks/useObserver';
import useAvailableHeight from '../../hooks/useAvailibleHeight';
import ContentArticle from './Article';
import ContentSidebar from './Siderbar';
import { ContentStructure } from '../../types/types';

interface ContentProps {
  contentStructure: ContentStructure;
  loading: boolean;
}

// Fix this to be generic and not hardcoded
const scrollMargin = headerHeight + currentMargin + tabsHeight;

const Content = ({ contentStructure, loading }: ContentProps) => {
  const articleRefs = useRef<HTMLElement[]>([]);
  const tabletDevice = useMediaQuery(mediaQueries.tablet);
  const availibleHeight = useAvailableHeight(articleRefs.current?.pop());
  const observerHookData = useObserver(articleRefs, {
    // IntersectionObserver rootMargin is set to the height of the header
    // the header is position: sticky, so it will always be on top of the page
    // if this is not set the next article may be hidden behind the header when it's intersecting
    rootMargin: -headerHeight + 'px',
  });

  // Filter articles that contain only empty columns if loading is false
  const filteredStructure = useMemo(() => {
    return loading
      ? contentStructure
      : contentStructure
          ?.map((article) => ({
            ...article,
            columns: article.columns.filter(
              (column) => typeof column.value === 'boolean' || !!column.value
            ),
          }))
          .filter((article) => article.columns.length !== 0);
  }, [contentStructure, loading]);

  // Return the index of the first element that is intersecting
  const currentScrolledIndex = useMemo(() => {
    return Object.keys(observerHookData)
      .map((key) => observerHookData[key])
      .findIndex((item: any) => item.isIntersecting === true);
  }, [observerHookData]);

  return (
    <Stack
      spacing={spacings.xlarge}
      display={!tabletDevice ? 'grid' : 'flex'}
      justifyContent={'space-between'}
      gridTemplateColumns={!tabletDevice ? `minmax(0, 720px) 240px` : 'unset'}
      useFlexGap
    >
      <Stack spacing={spacings.xlarge} divider={<Divider />}>
        {filteredStructure.map((data, i) => (
          <Box
            key={i}
            id={data.slug}
            ref={(instance: HTMLElement) => (articleRefs.current[i] = instance)}
            sx={{ scrollMarginTop: scrollMargin }}
          >
            <ContentArticle loading={loading} {...data} />
          </Box>
        ))}

        <Box height={availibleHeight} />
      </Stack>
      {!tabletDevice && (
        <ContentSidebar
          contentStructure={filteredStructure}
          scrolledIndex={currentScrolledIndex}
          loading={loading}
        />
      )}
    </Stack>
  );
};

export default Content;
