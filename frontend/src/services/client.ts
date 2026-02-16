import { api } from "src/boot/axios";
import type {
  Client,
  ClientCreate,
  ClientSummary,
  ClientUpdate,
  ClientListParams,
  ClientListResponse,
} from "src/models";
import { sleep } from "src/utils/timing/sleep";

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

const summaries: ClientSummary[] = [
  { clientId: 1, totalPurchases: 15, totalPaid: 360, outstandingBalance: 450 },
  { clientId: 2, totalPurchases: 7, totalPaid: 0, outstandingBalance: 130.7 },
];

export async function getClients(params?: ClientListParams): Promise<Client[]> {
  const { data } = await api.get<ClientListResponse>("/clients", {
    params: params,
  });

  console.log(data.message);

  return data.clients;
}

export function getRecentClients(limit: number = 5): Client[] {
  return clients.slice(0, limit);
}

export async function getClientById(id: number): Promise<Client> {
  return new Promise((res, rej) => {
    const found = clients.find((client) => client.id === id);

    if (found) {
      res(found);
    } else {
      rej(new Error("Cliente não encontrado!"));
    }
  });
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
): Promise<Client> {
  await sleep(300);

  return new Promise((res, rej) => {
    const index = clients.findIndex((client) => client.id === id);
    if (index === -1) {
      return rej(new Error(`Cliente de id ${id} não encontrado!`));
    }

    const client = clients[index];
    if (!client) {
      return rej(new Error(`Cliente de id ${id} não encontrado!`));
    }

    const updatedClient: Client = {
      ...client,
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    clients[index] = updatedClient;

    res(updatedClient);
  });
}

export async function getClientSummary(
  clientId: number
): Promise<ClientSummary> {
  return new Promise((res, rej) => {
    const found = summaries.find((summary) => summary.clientId === clientId);
    if (found) {
      res(found);
    } else {
      rej(new Error("Resumo do cliente não encontrado!"));
    }
  });
}
