import { DataGrid as MuiDataGrid, nlNL, GridFilterModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { DataGridProps } from '../../types/types';
import DataGridToolbar from './Toolbar';
import DataGridLoadingOverlay from './LoadingOverlay';
import { useState, useEffect } from 'react';

function DataGrid({
  loading,
  height,
  rows,
  columns,
  showQuickFilter,
  defaultFilters = [],
  columnVisibilityModel,
  ...rest
}: DataGridProps) {
  const [visibilityModel, setVisibilityModel] = useState(columnVisibilityModel);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: defaultFilters,
  });

  // For some reason, after data is reloaded, the filters are cleared.
  // So this is programmatically resetting them.
  useEffect(() => {
    if (!loading) {
      setFilterModel({ items: defaultFilters });
    }
  }, [loading]);

  return (
    <Box
      component={'section'}
      sx={{
        height: height ? height : 1000,
        width: '100%',
      }}
    >
      <MuiDataGrid
        rows={rows}
        columns={columns}
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
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
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
        {...rest}
      />
    </Box>
  );
}

export default DataGrid;
