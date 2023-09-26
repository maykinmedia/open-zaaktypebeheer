import { Skeleton, Stack, Typography } from '@mui/material';
import { decamelizeText, widthText } from '../../utils/text';
import { dynamicWidth } from '../DesignSystem/DesignSystem';
import { isEmpty, isValue } from '../../utils/is';
import { ContentColumnStructure } from '../../types/types';
import ValueRenderer from './ValueRenderer';

interface ContentColumnProps extends ContentColumnStructure {
  loading: boolean;
}

const ContentColumn = (props: ContentColumnProps) => {
  const { value, loading, fullWidth } = props;
  const label = decamelizeText(props.label);
  if (!loading && isEmpty(value)) return;

  return (
    <Stack width={'100%'} maxWidth={fullWidth ? '100%' : dynamicWidth(2, 32)}>
      <Typography variant="h3" gutterBottom>
        {loading ? <Skeleton width={widthText(label, 5)} /> : label}
      </Typography>
      {loading ? (
        <>
          <Skeleton />
          {fullWidth && <Skeleton width={'90%'} />}
        </>
      ) : (
        <ValueRenderer label={label} value={value} type={isValue(value)} />
      )}
    </Stack>
  );
};

export default ContentColumn;
