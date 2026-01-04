import type { Client, ClientCreate, ClientUpdate } from "src/models";

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

export function getClients(): Client[] {
  return clients;
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
  return new Promise((res, rej) => {
    const index = clients.findIndex((client) => client.id === id);
    if (index === -1) {
      return rej(new Error(`Cliente de id ${id} não encontrado!`));
    }

    const client = clients[index];
    if (!client) {
      return rej(new Error(`CLiente de id ${id} não encontrado!`));
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
