import { GridColDef } from '@mui/x-data-grid';
import { createResultWithTypes, createSingleGridColDef, skippedColumns } from '../utils';

/**
 * Create default columns for the DataGrid
 * A default column is a column that is not a link, edit, title or checkbox column.
 * @param loading - loading state
 * @param rows - Zaaktypen or Attributen
 * @returns array of default columns
 */
export const defaultColumns = (loading: boolean, rows: any) => {
  if (!rows) return [];
  const resultWithTypes = createResultWithTypes(rows);

  return Object.entries(resultWithTypes)
    .map(([columnLabel, columnType]) => {
      if (skippedColumns.includes(columnLabel)) return;
      return createSingleGridColDef(loading, columnLabel, columnType);
    })
    .filter((x) => x !== undefined) as GridColDef[];
};
