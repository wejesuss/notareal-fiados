import type { QCardActionsProps, QIconProps } from "quasar";
import type { Purchase } from "src/models";

export interface SystemOverviewCardProps {
  /**
   * If system status is up or down
   */
  isHealthy: boolean;
  /**
   * string representing the last update time
   */
  lastUpdated?: string | null;
  /**
   * Number of `clients` currently active
   */
  activeClients: number;
  /**
   * Number of `purchases` not entirely paid (`pending` or `partial`)
   */
  openPurchases: number;
  /**
   * Total amount to receive considering not paid `purchases`
   */
  openAmount: number;
}

export interface RecentRegistry {
  id: string | number;
  name: string;
  value: string | number;
  valueComplement?: string;
  valueColor?: string;
  icon?: string;
  iconColor?: QIconProps["color"];
}

export interface RegistryCardProps {
  id: string | number;
  title: string;
  titleVariant?: "default" | "emphasis" | "muted";
  subtitle?: string;
  route: string;
  actionLabel: string;
  actionsAlign?: QCardActionsProps["align"];
  valueColor?: string;
  nameColor?: string;
  icon?: string;
  iconColor?: QIconProps["color"];
  recentRegistries: Array<RecentRegistry>;
}

export interface ClientPayload {
  name: string;
  nickname: string | null;
  phone: string | null;
  email: string | null;
}

export interface PurchasePayload {
  description: string;
  totalCents: number;
  noteNumber: string;
  // Optional payment fields for creation
  initialPayment?: {
    amountCents: number;
    method: string;

    paymentDescription?: string;
    paymentDate?: number | null;
    receiptNumber?: string;
  };
}

export interface PaymentPayload {
  description: string | null;
  amountCents: number;
  paymentDate: number | null;
  method: string;
  /** TODO: remove manual receipt number creation */
  receiptNumber: string; // REC-0001
}

export interface PurchaseStatusUI {
  label: string;
  color: string;
  textColor: string;
}

export interface PurchaseActiveStatusUI {
  label: string;
  color: string;
  textColor: string;
}

export type PurchaseUI = Purchase & {
  statusUI: PurchaseStatusUI;
  activeStatusUI: PurchaseActiveStatusUI;
};
