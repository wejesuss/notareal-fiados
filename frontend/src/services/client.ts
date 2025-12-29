import type { Client, ClientCreate } from "src/models";

const clients: Client[] = [
  {
    id: 1,
    name: "José Augusto",
    nickname: null,
    email: "joseaugusto32@example.com",
    isActive: false,
    createdAt: "2025-12-15T22:36:31",
    updatedAt: "2025-12-15T22:36:31",
  },
  {
    id: 2,
    name: "João Carlos",
    nickname: "joaocarlos",
    phone: "(99) 9900-9879",
    isActive: true,
    createdAt: "2025-12-15T22:36:31",
    updatedAt: "2025-12-15T22:36:31",
  },
];

export function getClients(): Client[] {
  return clients;
}

export function getRecentClients(limit: number = 5): Client[] {
  return clients.slice(0, limit);
}

export function createClient(payload: ClientCreate) {
  clients.unshift({
    id: clients.length + 1,
    isActive: true,
    createdAt: new Date().toISOString().slice(0, -5),
    updatedAt: new Date().toISOString().slice(0, -5),
    ...payload,
  });
}
