import { DataGrid as MuiDataGrid, nlNL } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { DataGridProps } from '../../types/types';
import DataGridToolbar from './Toolbar';
import DataGridLoadingOverlay from './LoadingOverlay';
import { useState } from 'react';

function DataGrid({
  loading,
  height,
  showQuickFilter,
  columnVisibilityModel,
  ...rest
}: DataGridProps) {
  const [visibilityModel, setVisibilityModel] = useState(columnVisibilityModel);
  return (
    <Box
      component={'section'}
      sx={{
        height: height ? height : 1000,
        width: '100%',
      }}
    >
      <MuiDataGrid
        {...rest}
        rowModesModel={rest.rowModesModel}
        slots={{
          loadingOverlay: DataGridLoadingOverlay,
          toolbar: DataGridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: showQuickFilter,
          },
        }}
        columnBuffer={2}
        columnThreshold={2}
        loading={loading}
        localeText={nlNL.components.MuiDataGrid.defaultProps.localeText}
        disableColumnMenu
        disableRowSelectionOnClick
        // local handling of column visibility
        onColumnVisibilityModelChange={(model) => {
          setVisibilityModel(model);
        }}
        columnVisibilityModel={visibilityModel}
      />
    </Box>
  );
}

export default DataGrid;
