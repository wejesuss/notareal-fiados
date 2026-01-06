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
  isActive: boolean;
}

export interface ClientSummary {
  clientId: number;
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
}
