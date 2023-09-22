import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { useAsync } from 'react-use';
import { InformatieObjectT, ZaaktypeResolvedT } from '../types/types';
import { spacings } from '../components/DesignSystem/DesignSystem';
import { get, post } from '../api/api';
import BulkEditor from '../components/BulkEditor/BulkEditor';
import { useGridApiRef } from '@mui/x-data-grid';
import { closeSnackbar, useSnackbar } from 'notistack';
import { useState } from 'react';
import { Close } from '@mui/icons-material';

const ZaaktypeEditView = () => {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const [newRelations, setNewRelations] = useState<any>([]);

  const { loading, value, error } = useAsync(async () => {
    const zaaktype: ZaaktypeResolvedT = await get(`catalogi/zaaktypen/${params.zaaktypeUuid}/`);
    const informatieobjecttypen: InformatieObjectT[] = await get(
      `catalogi/informatieobjecttypen/?catalogus=${zaaktype.catalogus}&status=alles`
    );
    return { zaaktype, informatieobjecttypen };
  }, [newRelations]);

  // Do not show reload state after saving
  let loadingState = loading;
  if (newRelations.length > 0) loadingState = false;

  // Should be improved
  if (error) return <Alert severity="error">{error.message}</Alert>;

  const handleSave = async () => {
    const selection = apiRef.current.state.rowSelection;
    const updatedRows = selection.map((item) => apiRef.current.getRow(item));
    const notValid = updatedRows.filter((item) => !item.richting);
    const notValidKeys = notValid.map((item) => item.omschrijving);
    const isValid = { valid: notValid.length === 0, notValidKeys };
    const statusTypen = value?.zaaktype.statustypen;

    const relations = updatedRows.map((item) => {
      const relation: any = {
        zaaktype: value?.zaaktype.url,
        informatieobjecttype: item.informatieobjecttype_url || item.url,
        volgnummer: item.volgnummer,
        richting: item.richting,
        statustype: !!item.statustype
          ? statusTypen?.find((type) => type.omschrijving === item.statustype)?.url
          : null,
      };
      if (item.informatieobjecttype_url) relation['url'] = item.url;
      return relation;
    });

    const updatedData = {
      zaaktypeUrl: value?.zaaktype.url,
      relations: [...relations],
    };

    if (!isValid.valid) {
      return enqueueSnackbar('Richting is verplicht op alle velden', {
        variant: 'error',
        hint: `Controleer: ${isValid.notValidKeys.join(', ')}`,
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
      });
    }

    try {
      const response = await post('catalogi/zaaktype-informatieobjecttypen/', updatedData);
      const data = response.data;
      if (data.status === 'succeeded') {
        enqueueSnackbar('Informatieobjecttypen zijn succesvol gekoppeld', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 1000,
          anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
        setNewRelations(relations);
      }
      if (data.status === 'failed') {
        enqueueSnackbar('Een aantal velden zijn niet gewijzigd', {
          variant: 'error',
          hint: 'Probeer het nogmaals',
          preventDuplicate: true,
          anchorOrigin: { horizontal: 'right', vertical: 'top' },
        });
      }
    } catch (_error) {
      // Add error handling
    }
  };

  const handleQuit = () => {
    const sameData = true;

    const navigateQuit = () => {
      closeSnackbar();
      navigate('..', { relative: 'path' });
    };

    if (!sameData) {
      enqueueSnackbar('Er zijn niet opgeslagen wijzigingen', {
        preventDuplicate: true,
        variant: 'unsavedChanges',
        hint: 'Weet je zeker dat je wilt annuleren?',
        persist: true,
        action: () => (
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="body2">
              Zaaktype toch opslaan?
            </Typography>
            <Button size="small" color="primary" startIcon={<Close />} onClick={navigateQuit}>
              Ja, ik wil annuleren
            </Button>
          </Box>
        ),
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    } else {
      navigateQuit();
    }
  };

  return (
    <Stack direction={'row'} flexWrap={'wrap'} width={'100%'} spacing={spacings.xlarge} useFlexGap>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        flexWrap={'wrap'}
        width={'100%'}
        spacing={spacings.large}
        useFlexGap
      >
        <Typography variant="h1">
          {loadingState ? <Skeleton variant="text" width={200} /> : value?.zaaktype?.omschrijving}
        </Typography>
        <Stack direction={'row'} spacing={spacings.small}>
          <Button variant="outlined" onClick={handleQuit}>
            Annuleren
          </Button>
          <Button variant="contained" onClick={handleSave} disableElevation>
            Opslaan
          </Button>
        </Stack>
        <Stack spacing={spacings.small} width="100%">
          <Typography variant="h2">
            {loadingState ? (
              <Skeleton variant="text" width={320} />
            ) : (
              'Koppel informatieobjecttypen'
            )}
          </Typography>
          <Typography variant="body2">
            {loadingState ? (
              <Skeleton variant="text" width={340} />
            ) : (
              'Hier kunt u de gekoppelde informatieobjecttypen wijzigen.'
            )}
          </Typography>
          <BulkEditor
            apiRef={apiRef}
            loading={loadingState}
            zaaktype={value?.zaaktype!}
            informatieobjecttypen={value?.informatieobjecttypen!}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ZaaktypeEditView;
