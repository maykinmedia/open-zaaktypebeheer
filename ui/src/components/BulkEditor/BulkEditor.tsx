import useDataGrid from '../../hooks/useDatagrid';
import { getInitialData } from '../DataGrid/utils';
import DataGrid from '../DataGrid/DataGrid';
import { BulkEditorProps, ColumnTypes } from '../../types/types';

export default function BulkEditor({
  loading,
  zaaktype,
  informatieobjecttypen,
  apiRef,
}: BulkEditorProps) {
  const columnNames: ColumnTypes[] = ['checkbox', 'edit', 'title', 'bulkEditor', 'default'];
  const initialData = getInitialData(zaaktype, informatieobjecttypen);
  const { gridHandlers, ...gridData } = useDataGrid(initialData, loading, columnNames);

  return (
    <DataGrid
      // ref
      apiRef={apiRef}
      // layout
      height={650}
      // state
      loading={loading}
      // data
      {...gridData}
      // interactive settings
      isCellEditable={(params) => !!params.row.volgnummer}
      disableRowSelectionOnClick
      editMode="row"
      checkboxSelection
      showQuickFilter
      // interactive handlers
      {...gridHandlers}
    />
  );
}
