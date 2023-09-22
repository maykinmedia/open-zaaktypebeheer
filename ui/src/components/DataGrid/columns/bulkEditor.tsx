import { GridColDef, GridColumnHeaderTitle } from '@mui/x-data-grid';
import { richtingOptions } from '../utils';
import { ucFirstText, widthText } from '../../../utils/text';
import { Skeleton } from '@mui/material';
import { StatusTypeT } from '../../../types/types';

export const bulkEditorColumns = (loading: boolean, zaaktype?: any) => {
  const statusTypeMap = zaaktype
    ? zaaktype?.statustypen?.map((statustype: StatusTypeT) => statustype.omschrijving)
    : [];

  const getStatusTypeOmschrijvingByUrl = (url: string) => {
    const statusType = zaaktype?.statustypen?.find(
      (statusType: StatusTypeT) => statusType.url === url || statusType.omschrijving === url
    );
    return statusType?.omschrijving;
  };

  const columns: GridColDef[] = [
    {
      field: 'richting',
      type: 'singleSelect',
      valueOptions: richtingOptions,
      editable: true,
      width: 110,
    },
    {
      field: 'statustype',
      type: 'singleSelect',
      valueOptions: ['Geen statustype', ...statusTypeMap],
      editable: true,
      width: 180,
      valueFormatter: (params) => {
        if (params.api.isRowSelected(params.id!))
          return getStatusTypeOmschrijvingByUrl(params.value) || 'Geen statustype';
      },
    },
    {
      field: 'volgnummer',
      type: 'number',
      width: 120,
    },
  ];

  const columnFormat: GridColDef[] = columns.map((column) => {
    return {
      ...column,
      description: ucFirstText(column.field),
      headerName: ucFirstText(column.field),
      sortable: false,
      hideable: false,
      renderHeader: () =>
        loading ? (
          <Skeleton variant="text" width={widthText(column.field, 5)} height={26} />
        ) : (
          <GridColumnHeaderTitle
            label={ucFirstText(column.field)}
            columnWidth={column.width!}
            description={ucFirstText(column.field)}
          />
        ),
    };
  });

  return columnFormat;
};
