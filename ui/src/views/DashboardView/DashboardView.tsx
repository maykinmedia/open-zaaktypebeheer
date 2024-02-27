import React, { useEffect, useMemo, useState } from 'react';
import { attributeOnQueryFilter } from '../../utils/filter';
import { Query, ZaaktypeT, CatalogusT, SavedCatalogusT } from '../../types/types';
import { useAsync } from 'react-use';
import { get } from '../../api/api';
import { uuidExtract } from '../../utils/extract';
import {
  Body,
  Card,
  ErrorMessage,
  Form,
  H1,
  Outline,
  Toolbar,
} from '@maykin-ui/admin-ui/components';
import { AttributeData, Attribute } from '@maykin-ui/admin-ui/lib';
import { List } from '@maykin-ui/admin-ui/templates';
import { useNavigate } from 'react-router-dom';

const DashboardView = () => {
  const fields = ['identificatie', 'omschrijving', 'beginGeldigheid', 'eindeGeldigheid'];

  const navigate = useNavigate();

  const [selectedCatalogus, setSelectedCatalogus] = useState<SavedCatalogusT>('all');
  const [catalogussen, setCatalogussen] = useState<CatalogusT[]>([]);
  const [zaaktypen, setZaaktypen] = useState<ZaaktypeT[]>([]);

  const [query, setQuery] = useState<Query>('');

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

  const filteredZaaktypen = attributeOnQueryFilter(
    query,
    zaaktypen,
    fields as (keyof ZaaktypeT)[]
  ).map((z) => {
    const url = z.url ? `/zaaktypen/${uuidExtract(z.url)}` : undefined;
    return {
      absolute_url: url,
      ...z,
    };
  });
  const onCatalogusChange = (event: any) => {
    const catalogusUrl = event.target.value;
    localStorage.setItem('catalogus', catalogusUrl);
    setSelectedCatalogus(catalogusUrl);
  };

  const isLoading = loadingZaaktypen || loadingCatalogi;

  const selectOptions = [
    { label: 'Alle catalogussen', value: 'all' },
    ...(loadingCatalogi ? [] : catalogiOptions).map(([value, label]) => ({ value, label })),
  ];

  return (
    <List
      fields={fields}
      loading={isLoading}
      results={filteredZaaktypen as unknown as AttributeData<Attribute>[]}
      sort={true}
      onClick={(_: React.MouseEvent, attributeData: AttributeData) => {
        navigate('/zaaktypen/' + uuidExtract(attributeData.url as string));
      }}
    >
      <Card>
        <Body>
          {errorCatalogi && (
            <ErrorMessage>
              Er is een fout opgetreden bij het ophalen van de catalogi. Probeer het opnieuw.
            </ErrorMessage>
          )}
          {errorZaaktypen && (
            <ErrorMessage>
              Er is een fout opgetreden bij het ophalen van de zaaktypen. Probeer het opnieuw.
            </ErrorMessage>
          )}

          <Toolbar align="space-between">
            <H1>
              Zaaktypen&nbsp;
              {isLoading && <Outline.ArrowPathIcon spin={true} aria-label={'Bezig met laden'} />}
            </H1>

            <Form
              autoComplete="off"
              direction="horizontal"
              showActions={false}
              fields={[
                {
                  disabled: loadingCatalogi,
                  defaultValue: 'all',
                  label: 'Selecteer catalogus',
                  options: selectOptions,
                  value: selectedCatalogus,
                  onChange: onCatalogusChange,
                },
                {
                  label: 'Filter resultaten',
                  placeholder: 'ZAAKTYPE-XXXX-XXXXXXXXXX',
                  size: 24,
                  value: query,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
                },
              ]}
            />
          </Toolbar>
        </Body>
      </Card>
    </List>
  );
};

export default DashboardView;
