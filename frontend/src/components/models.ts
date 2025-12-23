export interface RegistryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  route: string;
  actionLabel: string;
  valueColor?: string;
  nameColor?: string;
  icon?: string;
  iconColor?: string;
  recentRegistries: Array<{
    id: string | number | symbol;
    name: string;
    value: string | number;
    valueComplement?: string;
  }>;
}
