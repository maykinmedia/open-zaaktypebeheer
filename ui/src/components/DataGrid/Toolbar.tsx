import { Tune } from '@mui/icons-material';
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarProps,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

const DataGridToolbar = (props: GridToolbarProps) => {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      {props.showQuickFilter && <GridToolbarQuickFilter sx={{ mr: 'auto' }} />}
      <GridToolbarColumnsButton startIcon={<Tune />} size="small" />
      <GridToolbarDensitySelector size="small" />
    </GridToolbarContainer>
  );
};

export default DataGridToolbar;
