from zgw_consumers.api_models.types import JSONObject
from zgw_consumers.client import ZGWClient
from zgw_consumers.concurrent import parallel


def fetch_informatieobjecttypen(urls: list[str], client: ZGWClient) -> list[JSONObject]:
    def _fetch(url: str):
        return client.retrieve("informatieobjecttype", url=url)

    with parallel() as executor:
        resp_data = executor.map(_fetch, urls)

    return list(resp_data)
