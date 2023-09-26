import { Skeleton } from '@mui/material';
import { GridColDef, GridColumnHeaderTitle } from '@mui/x-data-grid';

export const titleColumn: (loading: boolean) => GridColDef = (loading: boolean) => ({
  field: 'omschrijving',
  headerName: 'Omschrijving',
  description: 'omschrijving',
  type: 'string',
  width: 220,
  minWidth: 220,
  flex: 2,
  hideable: false,
  renderHeader: () =>
    loading ? (
      <Skeleton variant="text" width={90} height={26} />
    ) : (
      <GridColumnHeaderTitle label="Omschrijving" columnWidth={220} description="Omschrijving" />
    ),
});
