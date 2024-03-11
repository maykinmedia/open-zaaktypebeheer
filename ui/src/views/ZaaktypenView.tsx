import {useNavigate, useParams} from 'react-router';
import {useAsync} from 'react-use';
import {get} from '../api/api';
import {getInitialData} from '../components/DataGrid/utils';
import {Body, Detail, ErrorMessage, FieldSet, Outline, ToolbarItem} from '@maykin-ui/admin-ui'
import {useConfig} from "../components/Config/Config.tsx";

const ZaaktypeView = () => {
    const config = useConfig();
    const navigate = useNavigate();
    const params = useParams();
    const {value: object, error} = useAsync(async () => await get(`catalogi/zaaktypen/${params.zaaktypeUuid}/`), []);
    const initialData = getInitialData(object);

    const actions: ToolbarItem[] = [
        {
            children: <><Outline.PencilIcon/>Wijzigen</>,
            onClick: () => navigate(`/zaaktypen/${params.zaaktypeUuid}}/wijzigen`)
        },
        {
            children: <><Outline.PencilSquareIcon/>Wijzig in admin</>,
            href: config.openzaakAdminUrl + `/catalogi/zaaktype/?q=${params.zaaktypeUuid}`,
        },
    ]

    const fieldsets: FieldSet[] = [
        ['Algemeen', {
            fields: [
                'uuid',
                'identificatie',
                'omschrijving',
                'omschrijvingGeneriek',
                'doel',
                'aanleiding',
                'toelichting',
                'indicatieInternOfExtern',
                'trefwoorden',
                'vertrouwelijkheidaanduiding',
                'productenOfDiensten',
                'verantwoordingsrelatie'
            ],
            span: 12,
        }],
        ['Behandeling', {
            fields: [
                'handelingInitiator',
                'onderwerp',
                'handelingBehandelaar',
                'doorlooptijd',
                'doel'
            ]
        }],
        ['Opschorten en verlengen', {
            fields: [
                'opschortingEnAanhoudingMogelijk',
                'verlengingMogelijk',
                'verlengingstermijn'
            ]
        }],
        ['Gemeentelijke selectielijst', {
            fields: [
                'selectielijstProcestype'
            ]
        }],
        ['Referentieproces', {
            fields: [
                'referentieprocesnaam',
                'referentieproceslink'
            ]
        }],
        ['Publicatie', {
            fields: [
                'publicatieIndicatie',
                'publicatietekst'
            ]
        }],
        ['Geldigheid', {
            fields: [
                'versiedatum',
                'datumBeginGeldigheid',
                'datumEindeGeldigheid'
            ]
        }],
    ];

    return (
        <Detail actions={actions} object={object} fieldsets={fieldsets} inlines={[{
            title: "Informatieobjecttypen",
            fields: ["omschrijving", "richting", "statustype", "volgnummer", "beginGeldigHeid"],
            objectList: initialData.rows,
        }]}>
            {error && <Body><ErrorMessage>{error.message}</ErrorMessage></Body>}
        </Detail>
    )
};

export default ZaaktypeView;
