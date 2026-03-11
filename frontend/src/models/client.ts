// Frontend models
export interface Client {
  id: number;
  name: string;
  nickname?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface ClientCreate {
  name: string;
  nickname?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface ClientUpdate {
  name?: string;
  nickname?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}

export interface ClientSummary {
  totalPurchases: number;
  totalPaidCents: number;
  outstandingBalanceCents: number;
  // computed float by pydantic
  totalPaid: number;
  outstandingBalance: number;
}

// API models
export type ClientListParams = {
  onlyActive?: boolean;
  limit?: number;
  offset?: number;
};

export type ClientWithMessageResponse = {
  message: string;
  client: Client;
};

export type ClientListResponse = {
  message: string;
  total: number;
  clients: Client[];
};
