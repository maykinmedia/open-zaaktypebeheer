import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { spacings } from '../DesignSystem/DesignSystem';
import { widthText } from '../../utils/text';
import { memo } from 'react';
import ContentColumn from './Column';
import { ContentArticleStructure } from '../../types/types';

interface ContentArticleProps extends ContentArticleStructure {
  loading: boolean;
}

const ContentArticle = ({ label, columns, loading }: ContentArticleProps) => {
  return (
    <Box component={'article'} display={'flex'} flexDirection={'column'} gap={spacings.large}>
      <Typography variant="h2">
        {loading ? <Skeleton width={widthText(label, 10)} /> : label}
      </Typography>

      <Stack flexWrap={'wrap'} spacing={spacings.large} useFlexGap direction={'row'}>
        {columns?.map((column, i) => (
          <ContentColumn key={i} loading={loading} {...column} />
        ))}
      </Stack>
    </Box>
  );
};

export default memo(ContentArticle);
