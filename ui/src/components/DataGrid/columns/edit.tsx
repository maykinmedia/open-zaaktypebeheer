import { ArrowDownward, ArrowUpward, Edit, Save } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import {
  GridActionsCellItem,
  GridColDef,
  GridColumnHeaderTitle,
  GridRowModes,
} from '@mui/x-data-grid';

interface CreateEditColumn {
  (loading: boolean, gridData: any): GridColDef;
}

export const editColumn: CreateEditColumn = (
  loading,
  { gridActionHandlers, rowModesModel, rowSelectionModel }
) => {
  return {
    field: 'actions',
    type: 'actions',
    headerName: 'Wijzig',
    hideable: false,
    description: 'Wijzig de relatie',
    width: 120,
    renderHeader: () =>
      loading ? (
        <Skeleton variant="text" width={45} height={26} />
      ) : (
        <GridColumnHeaderTitle label="Wijzig" columnWidth={120} description="Wijzig" />
      ),

    getActions: (params) => {
      // No action column
      // console.log(params);
      if (!params.row.volgnummer) return [<></>];

      // EditMode action column
      const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
      if (isInEditMode) {
        return [
          <GridActionsCellItem
            color="primary"
            icon={<ArrowUpward />}
            label={`Open ${params.row.omschrijving}`}
            disabled={params.row.volgnummer === 1}
            onClick={gridActionHandlers.handleRowUp(params.id)}
          />,
          <GridActionsCellItem
            color="primary"
            icon={<ArrowDownward />}
            label={`Open ${params.row.omschrijving}`}
            disabled={params.row.volgnummer >= rowSelectionModel.length}
            onClick={gridActionHandlers.handleRowDown(params.id)}
          />,
          <GridActionsCellItem
            icon={<Save />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            onClick={gridActionHandlers.handleSaveClick(params.id)}
          />,
        ];
      }

      // ViewMode action column
      return [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          className="textPrimary"
          onClick={gridActionHandlers.handleEditClick(params.id)}
          color="inherit"
        />,
      ];
    },
  };
};
