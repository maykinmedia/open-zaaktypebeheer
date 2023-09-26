import { Alert, Box, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Search from '../../components/Search/Search';
import ToggleButton from '../../components/ToggleButton/ToggleButton';
import { attributeOnQueryFilter } from '../../utils/filter';
import { Query, DataVisualLayout, ZaaktypeT, CatalogusT, SavedCatalogusT } from '../../types/types';
import { spacings } from '../../components/DesignSystem/DesignSystem';
import { useAsync } from 'react-use';
import { get } from '../../api/api';
import Select from '../../components/Select/Select';
import { uuidExtract } from '../../utils/extract';
import ErrorAlert from '../../components/Errors/ErrorAlert.tsx';
import GridAndStack from './GridAndStack.tsx';

const ARRAY_FOR_SKELETON = new Array(10).fill({}).map((_item, i) => ({ id: i }));

const DashboardView = () => {
  const [selectedCatalogus, setSelectedCatalogus] = useState<SavedCatalogusT>('');
  const [catalogussen, setCatalogussen] = useState<CatalogusT[]>([]);
  const [zaaktypen, setZaaktypen] = useState<ZaaktypeT[]>([]);

  const [query, setQuery] = useState<Query>('');
  const [dataVisualLayout, setDataVisualLayout] = useState<DataVisualLayout>('blocks');

  useEffect(() => {
    if (selectedCatalogus) return;

    const catalogusUrl = localStorage.getItem('catalogus');
    setSelectedCatalogus(catalogusUrl || '');
  }, []);

  const { loading: loadingCatalogi, error: errorCatalogi } = useAsync(async () => {
    const catalogi = await get('catalogi/catalogussen/');
    setCatalogussen(catalogi);
  }, []);

  const { loading: loadingZaaktypen, error: errorZaaktypen } = useAsync(async () => {
    if (!selectedCatalogus) return;

    const zaaktypenEndpoint = `catalogi/zaaktypen/?status=alles${
      selectedCatalogus !== 'all' ? `&catalogus=${selectedCatalogus}` : ''
    }`;
    const data: ZaaktypeT[] = await get(zaaktypenEndpoint);
    setZaaktypen(
      data.map((zaaktype) => ({
        ...zaaktype,
        id: uuidExtract(zaaktype.url),
      }))
    );
  }, [selectedCatalogus]);

  const catalogiOptions = useMemo(
    () => catalogussen.map((catalogus) => [catalogus.url, catalogus.domein]),
    [catalogussen]
  );

  const filteredZaaktypen = attributeOnQueryFilter(query, zaaktypen, 'omschrijving');

  const onCatalogusChange = (event: any) => {
    const catalogusUrl = event.target.value;
    localStorage.setItem('catalogus', catalogusUrl);
    setSelectedCatalogus(catalogusUrl);
  };

  const hasError = errorCatalogi || errorZaaktypen;
  const isLoading = loadingZaaktypen || loadingCatalogi;
  const showNumberOfZaaktypen = !errorZaaktypen && !loadingZaaktypen && catalogussen;

  return (
    <Stack component={'article'} spacing={spacings.large} useFlexGap>
      <Box width={'100%'}>
        <Typography variant="h1">Dashboard</Typography>
      </Box>
      <Stack
        width={'100%'}
        direction={'row'}
        flexWrap={'wrap'}
        spacing={spacings.medium}
        useFlexGap
        position={'sticky'}
        top={64}
        zIndex={1}
        sx={{
          pb: 2,
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Search label="Zoek naar zaaktypen" query={query} setQuery={setQuery} />
        <ToggleButton
          dataVisualLayout={dataVisualLayout}
          setDataVisualLayout={setDataVisualLayout}
        />
        <Select
          sx={{
            ml: { md: 'auto' },
          }}
          selectedValue={selectedCatalogus}
          onChange={onCatalogusChange}
          disabled={loadingCatalogi}
          data={loadingCatalogi ? [] : catalogiOptions}
          label="Selecteer catalogus"
          defaultValue={{ label: 'Alle catalogussen', value: 'all' }}
          optionSort="asc"
        />

        <Box width={'100%'}>
          <Typography variant={'h2'}>
            Zaaktypen {showNumberOfZaaktypen && `(${filteredZaaktypen.length})`}
          </Typography>
        </Box>
      </Stack>
      {errorCatalogi && (
        <ErrorAlert
          title={errorCatalogi.message}
          message="Er is een fout opgetreden bij het ophalen van de catalogi. Probeer het opnieuw."
        />
      )}
      {errorZaaktypen && (
        <ErrorAlert
          title={errorZaaktypen.message}
          message="Er is een fout opgetreden bij het ophalen van de zaaktypen. Probeer het opnieuw."
        />
      )}
      {!hasError && !selectedCatalogus && (
        <Alert severity="info">Selecteer eerst een catalogus</Alert>
      )}
      {!hasError && selectedCatalogus && (
        <GridAndStack
          loading={isLoading}
          layout={dataVisualLayout}
          data={isLoading ? ARRAY_FOR_SKELETON : filteredZaaktypen}
        />
      )}
    </Stack>
  );
};

export default DashboardView;
