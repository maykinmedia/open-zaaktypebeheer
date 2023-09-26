import {
  GridRowModesModel,
  GridRowModes,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
  GridRowEditStopParams,
  MuiEvent,
} from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { arrayOfObjectsSort } from '../utils/sort';
import { useNavigate } from 'react-router-dom';
import { GridActionHandlers, GridHandlers, useDataGridHook } from '../types/types';
import { defaultColumns } from '../components/DataGrid/utils';
import gridColIndex from '../components/DataGrid/columns';

const useDataGrid: useDataGridHook = (initialData, loading, columnNames) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowId[]>(initialData.selection);
  const [rows, setRows] = useState<any>(initialData.rows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});
  const navigate = useNavigate();

  const gridActionHandlers: GridActionHandlers = useMemo(() => {
    return {
      handleEditClick,
      handleSaveClick,
      handleRowUp,
      handleRowDown,
      handleNavigate,
    };
  }, [rows]);

  const gridHandlers: GridHandlers = useMemo(() => {
    return {
      onRowEditStop,
      processRowUpdate,
      onRowModesModelChange,
      onRowSelectionModelChange,
      onColumnVisibilityModelChange,
    };
  }, [rows]);

  const columns = columnNames
    .map(
      (column) =>
        gridColIndex(
          loading,
          {
            rows,
            rowModesModel,
            rowSelectionModel,
            gridActionHandlers,
          },
          initialData.zaaktype
        )[column]
    )
    .flat();

  const visibilityModel = useMemo(() => {
    if (columns.length === Object.keys(columnVisibilityModel).length) return columnVisibilityModel;
    const newModel = columnVisibilityModel;
    columns.forEach((column) => (newModel[column.field] = defaultColumns.includes(column.field)));
    return newModel;
  }, [columns, columnVisibilityModel]);

  useEffect(() => {
    if (initialData.rows.length !== rows.length) {
      setRows(initialData.rows);
      setRowSelectionModel(initialData.selection);
    }
    if (initialData.selection.length !== rowSelectionModel.length) {
    }
  }, [initialData]);

  function onRowEditStop(params: GridRowEditStopParams, event: MuiEvent) {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }

  function onRowModesModelChange(newRowModesModel: GridRowModesModel) {
    setRowModesModel(newRowModesModel);
  }

  // Improve function
  function onRowSelectionModelChange(newRowSelectionModel: GridRowSelectionModel) {
    const t = arrayOfObjectsSort(
      rows.map((field: any) => {
        if (newRowSelectionModel.includes(field.id)) {
          return {
            ...field,
            volgnummer: newRowSelectionModel.indexOf(field.id) + 1,
            richting: initialData.rows.find((item: any) => item.id === field.id).richting
              ? initialData.rows.find((item: any) => item.id === field.id).richting
              : '',
          };
        } else
          return {
            ...field,
            volgnummer: undefined,
            richting: '',
            statustype: '',
          };
      }),
      'volgnummer',
      'asc'
    );

    setRowModesModel((prev) => {
      let newObject: any = {};
      Object.keys(prev).forEach((key) => {
        if (!newRowSelectionModel.includes(key)) newObject[key] = { mode: GridRowModes.View };
        else newObject[key] = { mode: GridRowModes.Edit };
      });

      return newObject;
    });
    setRowSelectionModel(newRowSelectionModel);
    setRows(t);
  }

  function onColumnVisibilityModelChange(newModel: GridColumnVisibilityModel) {
    setColumnVisibilityModel(newModel);
  }

  function processRowUpdate(newRow: GridRowModel) {
    // Prevents from updating the row if a row is deselected
    const updatedRow = rowSelectionModel.includes(newRow.id)
      ? { ...newRow }
      : { ...rows.find((row: any) => row.id === newRow.id) };

    setRows(rows.map((row: any) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  }

  function handleEditClick(id: GridRowId) {
    return () => {
      setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }));
    };
  }

  function handleSaveClick(id: GridRowId) {
    return () => {
      setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }));
    };
  }

  // Could be improved
  // function that updates the fields state and edit this so the id has the volgnummer of the previous id, and all the others are updated accordingly
  function handleRowUp(id: GridRowId) {
    return () => {
      setRows(() => {
        const t = arrayOfObjectsSort(
          rows.map((field: any) => {
            const updatedField = rows.find((f: any) => f.id === id);
            const newField = {
              ...updatedField,
              volgnummer: updatedField?.volgnummer - 1,
            };
            if (updatedField.volgnummer === field.volgnummer) {
              return newField;
            } else if (field.volgnummer === newField?.volgnummer) {
              return {
                ...field,
                volgnummer: field.volgnummer + 1,
              };
            } else {
              return field;
            }
          }),
          'volgnummer',
          'asc'
        );
        console.log(t);
        return t;
      });
    };
  }

  // Could be improved
  function handleRowDown(id: GridRowId) {
    return () => {
      setRows(
        arrayOfObjectsSort(
          rows.map((field: any) => {
            const updatedField = rows.find((f: any) => f.id === id);
            const newField = {
              ...updatedField,
              volgnummer: updatedField?.volgnummer + 1,
            };
            if (updatedField.volgnummer === field.volgnummer) {
              return newField;
            } else if (field.volgnummer === newField?.volgnummer) {
              return {
                ...field,
                volgnummer: field.volgnummer - 1,
              };
            } else {
              return field;
            }
          }),
          'volgnummer',
          'asc'
        )
      );
    };
  }

  function handleNavigate(route: string) {
    return () => {
      navigate(route);
    };
  }

  return {
    gridActionHandlers,
    gridHandlers,
    rowSelectionModel,
    rows,
    rowModesModel,
    columns,
    columnVisibilityModel: visibilityModel,
  };
};

export default useDataGrid;
