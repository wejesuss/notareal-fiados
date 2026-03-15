import { api } from "src/api/api";
import { APIError, ErrorMessages } from "src/api/errors";
import type {
  Client,
  ClientCreate,
  ClientSummary,
  ClientUpdate,
  ClientListParams,
  ClientListResponse,
  ClientWithMessageResponse,
} from "src/models";

export async function getClients(
  params?: ClientListParams
): Promise<ClientListResponse> {
  const { data } = await api.get<ClientListResponse>("/clients", {
    params: params,
  });

  return data;
}

export async function getRecentClients(
  limit: number = 5
): Promise<ClientListResponse> {
  const { data } = await api.get<ClientListResponse>("/clients", {
    params: { limit },
  });

  return data;
}

export async function getClientById(id: number): Promise<Client> {
  const { data } = await api.get<Client>(`/clients/${id}`);

  return data;
}

export async function createClient(payload: ClientCreate) {
  const { data } = await api.post<ClientWithMessageResponse>(`/clients/`, {
    ...payload,
  });

  return data;
}

export async function updateClient(
  id: number,
  payload: ClientUpdate
): Promise<ClientWithMessageResponse> {
  const { isActive, ...clientData } = payload;
  let response: ClientWithMessageResponse | null = null;

  // Update client only if fields exist
  if (Object.keys(clientData).length > 0) {
    response = (await api.put(`/clients/${id}`, clientData)).data;
  }

  // Only change client status if status was provided
  if (isActive === true) {
    response = (await api.put(`/clients/${id}/activate`)).data;
  } else if (isActive === false) {
    response = (await api.delete(`/clients/${id}`)).data;
  }

  if (!response) {
    throw new APIError(ErrorMessages.UnexpectedError);
  }

  return response;
}

export async function getClientSummary(
  clientId: number
): Promise<ClientSummary> {
  const { data } = await api.get<ClientSummary>(`/clients/${clientId}/summary`);

  return data;
}
