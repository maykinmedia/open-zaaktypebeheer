import { Alert, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { useAsync } from 'react-use';
import { ColumnTypes, MenuItems, ZaaktypeResolvedT } from '../types/types';
import { get } from '../api/api';
import { spacings } from '../components/DesignSystem/DesignSystem';
import BreadCrumbs from '../components/BreadCrumbs/BreadCrumbs';
import useDataGrid from '../hooks/useDatagrid';
import { getInitialData } from '../components/DataGrid/utils';
import Menu from '../components/Menu/Menu';
import { MouseEvent, useState } from 'react';
import { useConfig } from '../components/Config/Config';
import DataGrid from '../components/DataGrid/DataGrid';
import Content from '../components/Content/Content';
import Tabs from '../components/Tabs/Tabs';
import { MoreHoriz } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { dataAlgemeenStructure } from '../data/Algemeen';

const columnNames: ColumnTypes[] = ['title', 'bulkEditor', 'default'];

const ZaaktypeView = () => {
  const params = useParams();
  const config = useConfig();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const onOpenMenu = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const onCloseMenu = () => setAnchorEl(null);

  const { loading, value, error } = useAsync(async () => {
    const zaaktype: ZaaktypeResolvedT = await get(`catalogi/zaaktypen/${params.zaaktypeUuid}/`);
    return { zaaktype };
  }, []);

  const initialData = getInitialData(value?.zaaktype);
  const { gridHandlers, ...gridData } = useDataGrid(initialData, loading, columnNames);
  const algemeenStructure = dataAlgemeenStructure(value?.zaaktype);

  const menuItems: MenuItems[] = [
    {
      component: 'a',
      label: 'Wijzig in admin',
      onClick: onCloseMenu,
      // @ts-expect-error href and target are not a valid MenuItem props, but are required for the `a` tag.
      href: config.openzaakAdminUrl + `/catalogi/zaaktype/?q=${params.zaaktypeUuid}`,
      target: '_blank',
    },
  ];

  // Should be improved
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Stack direction={'row'} flexWrap={'wrap'} width={'100%'} spacing={spacings.large} useFlexGap>
      <BreadCrumbs />
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        flexWrap={'wrap'}
        width={'100%'}
        spacing={spacings.large}
        useFlexGap
      >
        <Typography variant="h1">
          {loading ? <Skeleton variant="text" width={200} /> : value?.zaaktype?.omschrijving}
        </Typography>

        <Stack direction={'row'} spacing={spacings.small}>
          <Menu menuItems={menuItems} anchorEl={anchorEl} onCloseMenu={onCloseMenu} />
          <Button
            onClick={onOpenMenu}
            variant="outlined"
            size="large"
            sx={{ minWidth: 47.5, minHeight: 47.5, p: 0 }}
          >
            <MoreHoriz />
          </Button>
          {value?.zaaktype?.concept && (
            <Button
              component={Link}
              disableElevation
              variant="contained"
              size="large"
              to={'wijzigen'}
            >
              Wijzigen zaaktype
            </Button>
          )}
        </Stack>
        <Tabs tabNames={['Algemeen', 'Informatieobjecttypen']}>
          {/* Tab One */}
          <Content loading={loading} contentStructure={algemeenStructure} />
          {/* Tab Two */}
          <Stack spacing={spacings.medium}>
            <Typography variant="h2">Informatieobjecttypen</Typography>
            <DataGrid
              // layout
              height={500}
              // state
              loading={loading}
              // data
              {...gridData}
              // interactive settings
              isCellEditable={() => false}
              disableRowSelectionOnClick
              showQuickFilter
              // interactive handlers
              {...gridHandlers}
            />
          </Stack>
        </Tabs>
      </Stack>
    </Stack>
  );
};

export default ZaaktypeView;
