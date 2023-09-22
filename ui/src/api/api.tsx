import {
  APIError,
  BadRequest,
  NotAuthenticated,
  NotFound,
  PermissionDenied,
} from '../errors/errors';
import { CSRFToken } from './headers';

const fetchDefaults = {
  credentials: 'include', // required for Firefox 60, which is used in werkplekken
};

function getUrl(endpoint: string) {
  let apiUrl: string = import.meta.env.VITE_BASE_API_URL;
  if (!apiUrl.endsWith('/')) apiUrl = apiUrl + '/';
  if (endpoint.startsWith('/')) endpoint = endpoint.substring(1);
  return apiUrl + endpoint;
}

export function updateStoredHeadersValues(headers: Headers) {
  const CSRFTokenValue = headers.get(CSRFToken.headerName);
  if (CSRFTokenValue) {
    CSRFToken.setValue(CSRFTokenValue);
  }
}

export async function _request(endpoint: string, opts: any = {}) {
  const options = { ...fetchDefaults, ...opts };
  const url = getUrl(endpoint);
  const response = await fetch(url, options);

  await throwForStatus(response);
  updateStoredHeadersValues(response.headers);
  return response;
}

export async function _unsafe(method: string = 'POST', endpoint: string, data?: any, signal?: any) {
  const opts: any = {
    method,
    headers: {
      'Content-Type': 'application/json',
      [CSRFToken.headerName]: CSRFToken.getValue(),
    },
  };
  if (data) {
    opts.body = JSON.stringify(data);
  }
  if (signal) {
    opts.signal = signal;
  }
  const response = await _request(endpoint, opts);
  const responseData = response.status === 204 ? null : await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: responseData,
  };
}

export async function get(endpoint: string, params = {}, multiParams = []) {
  let searchParams = new URLSearchParams();
  if (Object.keys(params).length) {
    searchParams = new URLSearchParams(params);
  }
  if (multiParams.length > 0) {
    multiParams.forEach((param) => {
      const paramName = Object.keys(param)[0]; // param={foo: bar}
      searchParams.append(paramName, param[paramName]);
    });
  }

  if (searchParams.toString()) {
    endpoint += `?${searchParams}`;
  }

  const response = await _request(endpoint);
  const data = response.status === 204 ? null : await response.json();
  return data;
}

export async function post(endpoint: string, data: any, signal?: any) {
  const resp = await _unsafe('POST', endpoint, data, signal);
  return resp;
}

export async function patch(endpoint: string, data: any = {}) {
  const resp = await _unsafe('PATCH', endpoint, data);
  return resp;
}

export async function put(endpoint: string, data: any = {}) {
  const resp = await _unsafe('PUT', endpoint, data);
  return resp;
}

export async function destroy(endpoint: string) {
  const opts = {
    method: 'DELETE',
  };
  const response = await _request(endpoint, opts);
  if (!response.ok) {
    const responseData = await response.json();
    console.error('Delete failed', responseData);
    throw new Error('Delete failed');
  }
}

export async function throwForStatus(response: Response) {
  if (response.ok) return;

  let responseData: any = null;
  // Check if the response contains json data
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    responseData = await response.json();
  }

  let ErrorClass = APIError;
  let errorMessage = 'An API error occurred.';
  switch (response.status) {
    case 400: {
      ErrorClass = BadRequest;
      errorMessage = Object.keys(responseData).map((key) => responseData[key])[0];
      break;
    }
    case 401: {
      ErrorClass = NotAuthenticated;
      errorMessage = 'User not or no longer authenticated';
      break;
    }
    case 403: {
      ErrorClass = PermissionDenied;
      errorMessage = 'User has insufficient permissions.';
      break;
    }
    case 404: {
      ErrorClass = NotFound;
      errorMessage = 'Resource not found.';
      break;
    }
    default: {
      break;
    }
  }

  throw new ErrorClass(errorMessage, response.status, responseData?.detail);
}
