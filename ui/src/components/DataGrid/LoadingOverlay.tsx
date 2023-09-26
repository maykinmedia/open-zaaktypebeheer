import { useGridApiContext } from '@mui/x-data-grid';
import { Box, Skeleton, styled } from '@mui/material';
import { randomNumberBetween } from '@mui/x-data-grid/utils/utils';
import { useMemo } from 'react';

/**
 * Cell for the Skeleton loading overlay for the DataGrid
 */
const SkeletonCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/**
 * Skeleton loading overlay for the DataGrid
 * @see https://github.com/mui/mui-x/issues/1685
 */
function DataGridLoadingOverlay() {
  const apiRef = useGridApiContext();

  // @ts-expect-error; Function signature expects to be called with parameters, but the implementation suggests otherwise
  const rowHeight = apiRef.current.unstable_getRowHeight();
  const columns = apiRef.current.getVisibleColumns();

  const skeletonCells = useMemo(() => {
    const random = randomNumberBetween(123456, 25, 80);
    const array = [];

    for (let i = 0; i < 10; i += 1) {
      for (const column of columns) {
        const width = Math.round(random());
        if (column.field === 'link') array.push(<SkeletonCell key={`empty-${i}-link`} />);
        else if (column.field === '__check__')
          array.push(
            <SkeletonCell key={`column-${i}-${column.field}`} sx={{ justifyContent: column.align }}>
              <Skeleton sx={{ mx: 1 }} variant="rounded" width={`40%`} />
            </SkeletonCell>
          );
        else
          array.push(
            <SkeletonCell key={`column-${i}-${column.field}`} sx={{ justifyContent: column.align }}>
              <Skeleton sx={{ mx: 1 }} width={`${width}%`} />
            </SkeletonCell>
          );
      }
      array.push(<SkeletonCell key={`empty-${i}-void`} />);
    }
    return array;
  }, [columns]);

  return (
    <Box
      display={'grid'}
      gridAutoRows={rowHeight}
      gridTemplateColumns={`${columns
        .map(({ computedWidth }) => `${computedWidth}px`)
        .join(' ')} 1fr`}
    >
      {skeletonCells}
    </Box>
  );
}

export default DataGridLoadingOverlay;
