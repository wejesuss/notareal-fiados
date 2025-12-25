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
