import { GRID_CHECKBOX_SELECTION_COL_DEF, GridColDef } from '@mui/x-data-grid';

export const checkBoxColumn: GridColDef = {
  ...GRID_CHECKBOX_SELECTION_COL_DEF,
  hideable: false,
  renderHeader: () => <></>,
};
