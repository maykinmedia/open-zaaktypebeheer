import { ContentStructure, ZaaktypeResolvedT } from '../types/types';
import { uuidExtract } from '../utils/extract';

interface getContentStructure<T> {
  (data?: T): ContentStructure;
}

export const dataAlgemeenStructure: getContentStructure<ZaaktypeResolvedT> = (data) => [
  {
    label: 'Algemeen',
    slug: 'algemeen',
    columns: [
      {
        label: 'uuid',
        value: data ? uuidExtract(data?.url) : undefined,
        fullWidth: false,
      },
      {
        label: 'identificatie',
        value: data?.identificatie,
        fullWidth: false,
      },
      {
        label: 'omschrijving',
        value: data?.omschrijving,
        fullWidth: false,
      },
      {
        label: 'omschrijvingGeneriek',
        value: data?.omschrijvingGeneriek,
        fullWidth: false,
      },
      {
        label: 'doel',
        value: data?.doel,
        fullWidth: true,
      },
      {
        label: 'aanleiding',
        value: data?.aanleiding,
        fullWidth: true,
      },
      {
        label: 'toelichting',
        value: data?.toelichting,
        fullWidth: true,
      },
      {
        label: 'indicatieInternOfExtern',
        value: data?.indicatieInternOfExtern,
        fullWidth: true,
      },
      {
        label: 'trefwoorden',
        value: data?.trefwoorden,
        fullWidth: true,
      },
      {
        label: 'vertrouwelijkheidaanduiding',
        value: data?.vertrouwelijkheidaanduiding,
        fullWidth: true,
      },
      {
        label: 'productenOfDiensten',
        value: data?.productenOfDiensten,
        fullWidth: true,
      },
      {
        label: 'verantwoordingsrelatie',
        value: data?.verantwoordingsrelatie,
        fullWidth: true,
      },
    ],
  },
  {
    label: 'Behandeling',
    slug: 'behandeling',
    columns: [
      {
        label: 'handelingInitiator',
        value: data?.handelingInitiator,
        fullWidth: false,
      },
      {
        label: 'onderwerp',
        value: data?.onderwerp,
        fullWidth: false,
      },
      {
        label: 'handelingBehandelaar',
        value: data?.handelingBehandelaar,
        fullWidth: true,
      },
      {
        label: 'doorlooptijd',
        value: data?.doorlooptijd,
        fullWidth: true,
      },
      {
        label: 'doel',
        value: data?.servicenorm,
        fullWidth: true,
      },
    ],
  },
  {
    label: 'Opschorten en verlengen',
    slug: 'opschorten-en-verlengen',
    columns: [
      {
        label: 'opschortingEnAanhoudingMogelijk',
        value: data?.opschortingEnAanhoudingMogelijk,
        fullWidth: false,
      },
      {
        label: 'verlengingMogelijk',
        value: data?.verlengingMogelijk,
        fullWidth: false,
      },
      {
        label: 'verlengingstermijn',
        value: data?.verlengingstermijn,
        fullWidth: true,
      },
    ],
  },
  {
    label: 'Gemeentelijke selectielijst',
    slug: 'gemeentelijke-selectielijst',
    columns: [
      {
        label: 'selectielijstProcestype',
        value: data?.selectielijstProcestype,
        fullWidth: false,
      },
    ],
  },
  {
    label: 'Referentieproces',
    slug: 'referentieproces',
    columns: [
      {
        label: 'referentieprocesnaam',
        value: data?.referentieproces.naam,
        fullWidth: false,
      },
      {
        label: 'referentieproceslink',
        value: data?.referentieproces.link,
        fullWidth: false,
      },
    ],
  },
  {
    label: 'Publicatie',
    slug: 'publicatie',
    columns: [
      {
        label: 'publicatieIndicatie',
        value: data?.publicatieIndicatie,
        fullWidth: true,
      },
      {
        label: 'publicatietekst',
        value: data?.publicatietekst,
        fullWidth: true,
      },
    ],
  },
  {
    label: 'Geldigheid',
    slug: 'geldigheid',
    columns: [
      {
        label: 'versiedatum',
        value: data?.versiedatum,
        fullWidth: true,
      },
      {
        label: 'datumBeginGeldigheid',
        value: data?.beginGeldigheid,
        fullWidth: false,
      },
      {
        label: 'datumEindeGeldigheid',
        value: data?.eindeGeldigheid,
        fullWidth: false,
      },
    ],
  },
];
