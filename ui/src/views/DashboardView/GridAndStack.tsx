import useDataGrid from '../../hooks/useDatagrid.tsx';
import DataGrid from '../../components/DataGrid/DataGrid.tsx';
import { spacings } from '../../components/DesignSystem/DesignSystem.tsx';
import { Stack } from '@mui/material';
import { ColumnTypes, GridAndStackProps } from '../../types/types.tsx';
import Card from '../../components/Card/Card.tsx';
import { uuidExtract } from '../../utils/extract.tsx';

const columnNames: ColumnTypes[] = ['link', 'title', 'default'];

const GridAndStack = ({ loading, layout, data }: GridAndStackProps) => {
  const { gridHandlers, rows, columns, columnVisibilityModel } = useDataGrid(
    { rows: data, selection: [] },
    loading,
    columnNames
  );

  if (layout === 'datagrid')
    return (
      <DataGrid
        height={610}
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        loading={loading}
        defaultFilters={[{ field: 'actief', operator: 'is', value: 'true' }]}
        {...gridHandlers}
      />
    );

  if (loading)
    return (
      <Stack
        direction={'row'}
        flexWrap={'wrap'}
        width={'100%'}
        spacing={spacings.medium}
        useFlexGap
      >
        {data.map((_item, i) => (
          <Card key={i} loading={true} />
        ))}
      </Stack>
    );

  return (
    <Stack direction={'row'} flexWrap={'wrap'} width={'100%'} spacing={spacings.medium} useFlexGap>
      {data.map((zaaktype: any) => {
        const description = `Begin geldigheid: ${zaaktype.beginGeldigheid}`;
        const detailUrl = zaaktype?.url ? '/zaaktypen/' + uuidExtract(zaaktype.url) : '';

        return (
          <Card
            key={zaaktype.url}
            title={zaaktype.omschrijving}
            description={description}
            loading={false}
            detailUrl={detailUrl}
          />
        );
      })}
    </Stack>
  );
};

export default GridAndStack;
