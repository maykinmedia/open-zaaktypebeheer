import { ArrowForward } from '@mui/icons-material';
import { Skeleton, Tooltip } from '@mui/material';
import { GridActionsCellItem, GridColDef, GridColumnHeaderTitle } from '@mui/x-data-grid';

export const linkColumn: (loading: boolean, gridActions: any) => GridColDef = (
  loading,
  { gridActionHandlers }
) => ({
  field: 'link',
  type: 'actions',
  description: 'Link naar zaaktype',
  width: 40,
  hideable: false,
  sortable: false,
  renderHeader: () =>
    loading ? (
      <Skeleton variant="text" width={45} height={26} />
    ) : (
      <GridColumnHeaderTitle label="Link" columnWidth={120} description="Link" />
    ),
  getActions: (params) => [
    <Tooltip title={`Open ${params.row.omschrijving}`}>
      <GridActionsCellItem
        color="primary"
        icon={<ArrowForward />}
        label={`Open ${params.row.omschrijving}`}
        onClick={gridActionHandlers.handleNavigate(`../zaaktypen/${params.id}`)}
      />
    </Tooltip>,
  ],
});
