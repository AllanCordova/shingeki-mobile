import { usePathname } from "expo-router";

export default function useIsRoot(): boolean {
  const pathname = usePathname();

  return pathname === "/";
}
