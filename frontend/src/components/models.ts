import type { QIconProps } from "quasar";

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

export interface RegistryCardProps {
  id: string | number;
  title: string;
  titleVariant?: "default" | "emphasis" | "muted";
  subtitle?: string;
  route: string;
  actionLabel: string;
  valueColor?: string;
  nameColor?: string;
  icon?: string;
  iconColor?: QIconProps["color"];
  recentRegistries: Array<{
    id: string | number;
    name: string;
    value: string | number;
    valueComplement?: string;
    valueColor?: string;
    icon?: string;
    iconColor?: QIconProps["color"];
  }>;
}

export type ClientPayload = {
  name: string;
  nickname: string | null;
  phone: string | null;
  email: string | null;
};
