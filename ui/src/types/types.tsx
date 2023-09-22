/**
 * Custom types are defined here.
 * They might need to be updated following the zaaktypebeheer-api.
 */
import {
  DataGridProps as MuiDataGridProps,
  GridColDef,
  GridRowId,
  GridColumnVisibilityModel,
  GridRowModesModel,
  GridEventListener,
  GridRowModel,
  GridRowSelectionModel,
  GridCallbackDetails,
} from '@mui/x-data-grid';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { AuthContextType } from '../components/Auth/Auth';
import { MenuItemProps, LinkProps } from '@mui/material';

//-----------------------//
//    Data Structures    //
//-----------------------//

export type ZaaktypeResolvedT = Omit<ZaaktypeT, 'informatieobjecttypen' | 'statustypen'> & {
  informatieobjecttypen: ZaaktypeInformatieRelatieT[];
  statustypen: StatusTypeT[];
};

export type ZaaktypeT = {
  url: string;
  identificatie?: string;
  omschrijving: string;
  omschrijvingGeneriek?: string;
  vertrouwelijkheidaanduiding:
    | 'openbaar'
    | 'beperkt_openbaar'
    | 'intern'
    | 'zaakvertrouwelijk'
    | 'vertrouwelijk'
    | 'confidentieel'
    | 'geheim'
    | 'zeer_geheim';
  doel: string;
  aanleiding: string;
  toelichting?: string;
  indicatieInternOfExtern: 'intern' | 'extern' | 'uitgaand';
  handelingInitiator: string;
  onderwerp: string;
  handelingBehandelaar: string;
  doorlooptijd: string;
  servicenorm?: string | null;
  opschortingEnAanhoudingMogelijk: boolean;
  verlengingMogelijk: boolean;
  verlengingstermijn?: string;
  trefwoorden?: string[];
  publicatieIndicatie: boolean;
  publicatietekst?: string;
  verantwoordingsrelatie?: string[];
  productenOfDiensten: string[];
  selectielijstProcestype?: string;
  referentieproces: {
    naam: string;
    link?: string;
  };
  catalogus: string;
  statustypen?: string[];
  resultaattypen?: string[];

  eigenschappen?: string[];
  informatieobjecttypen?: InformatieObjectT[] | string[];

  roltypen?: string[];
  besluittypen: string[];
  deelzaaktypen?: string[];

  gerelateerdeZaaktypen?: {
    zaaktype: string;
    aardRelatie: 'vervolg' | 'bijdrage' | 'onderwerp';
    toelichting?: string;
  }[];
  beginGeldigheid: string;
  eindeGeldigheid?: string;
  versiedatum: string;
  concept?: boolean;
};

export type InformatieObjectT = {
  url: string;
  catalogus: string;
  omschrijving: string;
  zaaktype: string;
  vertrouwelijkheidaanduiding: string;
  beginGeldigheid: string;
  eindeGeldigheid: string;
  concept: boolean;
};

export type ZaaktypeInformatieRelatieT = {
  url: string;
  zaaktype: string;
  informatieobjecttype: InformatieObjectT;
  richting: 'inkomend' | 'uitgaand' | 'intern';
  statustype?: string | null;
  volgnummer: number;
};

export type StatusTypeT = {
  informeren: boolean;
  isEindstatus: boolean;
  omschrijving: string;
  omschrijvingGeneriek: string;
  url: string;
  statustekst: string;
  zaaktype: string;
};

export type ContentStructure = ContentArticleStructure[];

export type ContentArticleStructure = {
  label: string;
  slug: string;
  columns: ContentColumnStructure[];
};

export type ContentColumnStructure = {
  label: string;
  value: any;
  fullWidth: boolean;
};

export type CatalogusT = {
  url: string;
  domein: string;
  rsin: string;
  contactpersoonBeheerNaam: string;
  contactpersoonBeheerTelefoonnummer: string;
  contactpersoonBeheerEmailadres: string;
  concept: boolean;
  zaaktypen: string[];
  besluittypen: string[];
  informatieobjecttypen: string[];
};

export type SavedCatalogusT = string;

//-----------------------//
//    Use-state Types    //
//-----------------------//
export type Query = string;
export type SetQuery = Dispatch<SetStateAction<Query>>;

export type DataVisualLayout = 'blocks' | 'datagrid';
export type SetDataVisualLayout = Dispatch<SetStateAction<DataVisualLayout>>;

//----------------------//
//    ComponentProps    //
//----------------------//
/** Props for Search component  */
export type SearchProps = {
  query: Query;
  setQuery: SetQuery;
  label: string;
  fullWidth?: boolean;
};

export type ErrorAlertProps = {
  title: string;
  message: string;
};

export type GridAndStackProps = {
  loading: boolean;
  layout: string;
  data: any[];
};

/** Props for Breadcrumbs component */
export interface StyledRoutedLinkProps extends LinkProps {
  to: string;
  replace?: boolean;
}

/** Props for ToggleButton component  */
export type ToggleButtonProps = {
  dataVisualLayout: DataVisualLayout;
  setDataVisualLayout: SetDataVisualLayout;
};

/** Props for Card component  */
export type CardProps = {
  title?: string;
  description?: string;
  detailUrl?: string;
  loading?: boolean;
};

/**- BulkEditor -**/
/** Props for BulkEditor component */
export interface BulkEditorProps {
  loading: boolean;
  zaaktype: ZaaktypeResolvedT;
  informatieobjecttypen: InformatieObjectT[];
  apiRef?: any;
}

/**- DataGrid -**/
/** Props for DataGrid component  */
export type DataGridProps = MuiDataGridProps & {
  height?: number;
  loading?: boolean;
  showQuickFilter?: boolean;
};

export interface GridActionHandlers {
  handleEditClick: (id: GridRowId) => () => void;
  handleSaveClick: (id: GridRowId) => () => void;
  handleRowUp: (id: GridRowId) => () => void;
  handleRowDown: (id: GridRowId) => () => void;
  handleNavigate: (route: string) => () => void;
}

export interface GridHandlers {
  onColumnVisibilityModelChange: (newModel: GridColumnVisibilityModel) => void;
  onRowEditStop: GridEventListener<'rowEditStop'>;
  processRowUpdate: (newRow: GridRowModel) => GridRowModel;
  onRowModesModelChange: (newRowModesModel: GridRowModesModel) => void;
  onRowSelectionModelChange: (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => void;
}

/** DataGrid column types */
export interface GetGridColIndex {
  (loading: boolean, gridData: any, zaaktype?: ZaaktypeResolvedT): GridColIndex;
}

export interface GridColIndex {
  title: GridColDef;
  checkbox: GridColDef;
  edit: GridColDef;
  bulkEditor: GridColDef[];
  default: GridColDef[];
  link: GridColDef;
}

export type ColumnTypes = keyof GridColIndex;

//-----------------//
//    Functions    //
//-----------------//

/**  Create single column definition function  */
export type CreateSingleGridColDefFunction = (
  loading: boolean,
  columnLabel: string,
  columnType: any
) => GridColDef | undefined;

/**  Create multiple column definitions function  */
export type CreateGridColDefFunction = (data: ZaaktypeT[] | InformatieObjectT[]) => GridColDef[];

//----------------//
//    Response    //
//----------------//
export type PaginatedResponse<T> = {
  count: number;
  previous: string | null;
  next: string | null;
  results: T[];
};

//-------------//
//    Hooks    //
//-------------//
export interface useDataGridHook {
  (
    initialData: any,
    loading: boolean,
    columnNames: ColumnTypes[],
    zaaktype?: ZaaktypeResolvedT
  ): DataGridHookReturn;
}

export interface DataGridHookReturn {
  rowSelectionModel: GridRowId[];
  rows: any;
  columns: GridColDef[];
  columnVisibilityModel: GridColumnVisibilityModel;
  rowModesModel: GridRowModesModel;
  gridActionHandlers: GridActionHandlers;
  gridHandlers: GridHandlers;
}

// Types from [#12], Fixes merge conflicts
// Fixing this in next PR :(
export type GetSiteTreeFunction = (
  navigate: NavigateFunction,
  auth: AuthContextType
) => SiteTreeOptions;

export type SiteTreeOptions = SiteTreeOptionT[];

export interface SiteTreeOptionT {
  label: string;
  Icon?: JSX.Element;
  onClick?: () => void;
}

export interface DrawerT {
  open: boolean;
  toggleDrawer: ToggleDrawerFunction;
}

export type ToggleDrawerFunction = (newState: boolean) => (event: any) => void;

export type DrawerListT = {
  siteTreeOptions: SiteTreeOptions;
};

export interface LogoT
  extends Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {}

// Login/Logout types and interfaces
export interface UserDataT {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Menu component types
export interface MenuProps {
  anchorEl: HTMLElement | null;
  menuItems: MenuItems[];
  onCloseMenu: () => void;
}
export interface MenuItems extends MenuItemProps {
  label: string;
}

// Tabs component types
export type TabsProps = {
  /** Define tab names must be equal to children length */
  tabNames: string[];
  /** Define children must be equal to tabNames length */
  children: ReactNode[];
};

declare module 'notistack' {
  interface VariantOverrides {
    error: {
      hint: string;
    };
    unsavedChanges: {
      hint: string;
    };
  }
}
