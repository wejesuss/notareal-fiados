import { api } from "src/api/api";
import type {
  Client,
  ClientCreate,
  ClientSummary,
  ClientUpdate,
  ClientListParams,
  ClientListResponse,
  ClientWithMessageResponse,
} from "src/models";

const clients: Client[] = [
  {
    id: 1,
    name: "José Augusto",
    nickname: null,
    email: "joseaugusto32@example.com",
    isActive: false,
    createdAt: "2025-12-15T22:36:31.000Z",
    updatedAt: "2025-12-15T22:36:31.000Z",
  },
  {
    id: 2,
    name: "João Carlos",
    nickname: "joaocarlos",
    phone: "(99) 9900-9879",
    isActive: true,
    createdAt: "2025-12-15T22:36:31.000Z",
    updatedAt: "2025-12-15T22:36:31.000Z",
  },
];

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

export function createClient(payload: ClientCreate) {
  clients.unshift({
    id: clients.length + 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...payload,
  });
}

export async function updateClient(
  id: number,
  payload: ClientUpdate
): Promise<ClientWithMessageResponse> {
  const clientData = { ...payload };
  delete clientData["isActive"];
  let response: ClientWithMessageResponse | null = null;

  if (clientData) {
    response = (await api.put(`/clients/${id}`, clientData)).data;
  }

  if (payload.isActive === true) {
    response = (await api.put(`/clients/${id}/activate`)).data;
  } else if (payload.isActive === false) {
    response = (await api.delete(`/clients/${id}`)).data;
  }

  if (!response) {
    throw new Error("Nenhum campo fornecido");
  }

  return response;
}

export async function getClientSummary(
  clientId: number
): Promise<ClientSummary> {
  const { data } = await api.get<ClientSummary>(`/clients/${clientId}/summary`);

  return data;
}
