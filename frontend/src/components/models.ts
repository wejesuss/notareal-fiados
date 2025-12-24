export interface RegistryCardProps {
  id: string | number;
  title: string;
  subtitle?: string;
  route: string;
  actionLabel: string;
  valueColor?: string;
  nameColor?: string;
  icon?: string;
  iconColor?: string;
  recentRegistries: Array<{
    id: string | number;
    name: string;
    value: string | number;
    valueComplement?: string;
  }>;
}
