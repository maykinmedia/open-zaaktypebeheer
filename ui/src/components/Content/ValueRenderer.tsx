import { Typography, Link } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import { isValue } from '../../utils/is';

interface ValueRendererProps {
  type: 'url' | 'boolean' | 'string' | 'array' | 'object';
  label?: string;
  value: any;
}

interface RendererProps extends Omit<ValueRendererProps, 'type'> {}

export const RenderArray = ({ label, value }: RendererProps) => {
  return value.map((item: any, i: number) => (
    <ValueRenderer key={i} label={label} value={item} type={isValue(item)} />
  ));
};

export const RenderUrl = ({ label, value }: RendererProps) => {
  return (
    <Link variant="body1" href={value} target="_blank" display={'flex'} gap={1} alignItems="center">
      Open {label}
      <OpenInNew fontSize="small" />
    </Link>
  );
};

export const RenderString = ({ value }: RendererProps) => {
  return <Typography variant="body1">{value}</Typography>;
};

export const RenderObject = ({ value }: RendererProps) => {
  const keys = Object.keys(value);

  return keys.map((key, i) => {
    return <ValueRenderer key={i} label={key} value={value[key]} type={isValue(value[key])} />;
  });
};

export const RenderBoolean = ({ value }: RendererProps) => {
  return <Typography variant="body1">{value ? 'Ja' : 'Nee'}</Typography>;
};

const rendererMap = {
  url: RenderUrl,
  boolean: RenderBoolean,
  string: RenderString,
  array: RenderArray,
  object: RenderObject,
};

const ValueRenderer = (props: ValueRendererProps) => {
  const Renderer = rendererMap[props.type];
  return <Renderer label={props?.label} value={props.value} />;
};

export default ValueRenderer;
