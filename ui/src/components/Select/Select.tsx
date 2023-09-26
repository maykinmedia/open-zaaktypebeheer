import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { outlinedInputStyling } from '../DesignSystem/DesignSystem';
import { useMemo } from 'react';

/** Props for the select component */
interface SelectProps extends MuiSelectProps {
  /**
   * Label for the select
   * @default 'Selecteer een optie'
   */
  label: string;
  /**
   * All option label for the select
   * @default { label: 'Alles', value: 'all'}
   */
  defaultValue?: {
    label: string;
    value: string;
  };
  /**
   * Selected value
   */
  selectedValue: string;
  /**
   * The data
   */
  data: Array<Array<string>>;
  /**
   * Maximum height of the select menu
   * @default 340
   */
  maxHeight?: number;
  /**
   * Minimum width of the select menu
   * @default 320
   */
  maxWidth?: number;
  /**
   * Sort options
   * @default 'asc'
   */
  optionSort?: 'asc' | 'desc';
}

const Select = ({
  label = 'Selecteer optie',
  optionSort = 'asc',
  selectedValue,
  data,
  maxHeight = 340,
  maxWidth = 320,
  ...rest
}: SelectProps) => {
  const sortedData = useMemo(
    () =>
      data.sort(function (optionA, optionB) {
        return optionA[1].localeCompare(optionB[1]);
      }),
    [data]
  );
  const options = [['all', 'Alle catalogi'], ...sortedData];

  return (
    <FormControl sx={{ minWidth: maxWidth, ...rest.sx }}>
      <InputLabel htmlFor="search" aria-label={label}>
        {label}
      </InputLabel>
      <MuiSelect
        {...rest}
        label={label}
        IconComponent={ExpandMore}
        value={selectedValue || ''}
        autoWidth
        sx={{
          ...outlinedInputStyling,
        }}
        MenuProps={{
          PaperProps: {
            variant: 'outlined',
            elevation: 0,
            sx: {
              mt: 1,
              width: '100%',
              maxHeight,
              maxWidth,
            },
          },
        }}
      >
        {options.map(([optionValue, optionLabel]) => (
          <MenuItem key={optionValue} value={optionValue}>
            {optionLabel}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
