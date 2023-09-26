import { flat } from '../../utils/flat';

import {
  CreateSingleGridColDefFunction,
  InformatieObjectT,
  ZaaktypeResolvedT,
  ZaaktypeT,
} from '../../types/types';
import { decamelizeText, widthText } from '../../utils/text';
import { attributesFromDataArray } from '../../utils/array';
import { uuidExtract } from '../../utils/extract';
import { arrayOfObjectsSort } from '../../utils/sort';
import { Skeleton } from '@mui/material';
import { GridColumnHeaderTitle } from '@mui/x-data-grid';

/**
 * Options for richting edit column
 * @use
 */
export const richtingOptions = ['inkomend', 'uitgaand', 'intern'];

/**
 * These are the default columns for the Datagrid
 * These columns can't be set to hidden.
 */
export const defaultColumns = [
  '__check__',
  'link',
  'actions',
  'omschrijving',
  'volgnummer',
  'richting',
  'statustype',
];

/**
 * These are all the fields that are not rendered in either the DataGrid or the BulkEditor
 */
export const skippedColumns = [
  '__check__',
  'actions',
  'omschrijving',
  'volgnummer',
  'richting',
  'statustype',
  'informatieobjecttype_url',
  'id',
  'url',
  'catalogus',
  'besluittypen',
  'deelzaaktypen',
  'eigenschappen',
  'gerelateerdeZaaktypen',
  'informatieobjecttypen',
  'informatieobjecttype',
  'productenOfDiensten',
  'resultaattypen',
  'roltypen',
  'selectielijstProcestype',
  'statustypen',
  'trefwoorden',
  'verantwoordingsrelatie',
  'zaaktype',
];

/**
 * Add an id to each row of the DataGrid
 * The id is used to index the row and to navigate to the zaaktype
 * If there is no url (loading state) the index of the row is used.
 * @param rows Zaaktypen or Attributen
 * @returns rows with id
 */
export const rowsWithId = (rows: ZaaktypeT[]) =>
  rows.map((row, i) => {
    return { ...row, id: row?.url ? uuidExtract(row.url) : i };
  });

/**
 * Create an object with the attributes of the results and their types.
 * Used for creating the column types for the DataGrid.
 * @param data Zaaktypen or Attributen
 * @returns Object with attributes and their types
 */
export const createResultWithTypes = (data: ZaaktypeT[] | InformatieObjectT[]) => {
  const resultWithTypes: any = {};
  const attributes = attributesFromDataArray(data);

  for (const attribute of attributes) {
    for (const obj of data) {
      const value = obj[attribute as keyof typeof obj];
      if (typeof value === 'undefined') break;
      resultWithTypes[attribute] = typeof value;
    }
  }
  return resultWithTypes;
};

/**
 * Create a column definition for the DataGrid, based on the attributes of the results.
 * @param key Property of zaaktype or informatieobject
 * @param value Value of zaaktype or informatieobject key
 * @returns column definition
 */
export const createSingleGridColDef: CreateSingleGridColDefFunction = (
  loading,
  columnLabel,
  columnType
) => {
  if (columnType === 'object') return undefined;

  const label = decamelizeText(columnLabel);
  return {
    field: columnLabel,
    headerName: decamelizeText(columnLabel),
    description: decamelizeText(columnLabel),
    type: columnType,
    minWidth: columnType == 'boolean' ? 100 : 220,
    flex: columnType == 'boolean' ? 0 : 1,
    renderHeader: () =>
      loading ? (
        <Skeleton variant="text" width={widthText(label, 6)} height={26} />
      ) : (
        <GridColumnHeaderTitle label={label} columnWidth={120} description={label} />
      ),
  };
};

/**
 * Get initial data for the data grid
 */
export function getInitialData(
  zaaktype?: ZaaktypeResolvedT,
  informatieobjecttypen?: InformatieObjectT[]
) {
  const infoObjectTypes = zaaktype?.informatieobjecttypen;
  const allInfoObjectTypes = informatieobjecttypen;

  // If there is no zaaktype, return empty data
  if (!infoObjectTypes) {
    return { rows: [], selection: [], zaaktype: zaaktype };
  }

  // if there is no informatieobjecttypen, return zaaktype data
  if (!allInfoObjectTypes) {
    const infoObjectTransformed = arrayOfObjectsSort(
      infoObjectTypes.map((row: any) => createRow(row)),
      'volgnummer',
      'asc'
    );
    return { rows: infoObjectTransformed, selection: [], zaaktype: zaaktype };
  }

  // Merge zaaktype data with informatieobjecttypen data and exclude duplicates.

  const existingRelations = arrayOfObjectsSort(
    infoObjectTypes.map((row: any) => createRow(row)),
    'volgnummer',
    'asc'
  );
  const allData = allInfoObjectTypes.map((row) => createRow(row));

  const selectedRows = existingRelations.map((item: any) => item.id);

  const mergedData = [
    ...existingRelations,
    ...allData.filter((row) => !selectedRows.includes(row.id)),
  ];

  const sortMergedData = arrayOfObjectsSort([...mergedData], 'volgnummer', 'asc');

  return { rows: sortMergedData, selection: selectedRows, zaaktype: zaaktype };
}

// Create row and add extra fields to prevent errors
export function createRow(row: any) {
  const flattedRow = flat(row);
  return {
    volgnummer: '',
    richting: '',
    statustype: '',
    id: uuidExtract(flattedRow.informatieobjecttype_url || flattedRow.url),
    ...flattedRow,
  };
}
