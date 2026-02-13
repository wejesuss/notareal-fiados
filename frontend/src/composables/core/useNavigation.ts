import { useRouter } from "vue-router";

export function useNavigation() {
  const router = useRouter();

  async function navigateTo(path: string) {
    await router.push(path);
  }

  return { navigateTo };
}
