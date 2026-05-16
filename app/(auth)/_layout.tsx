/**
 * Rotas autenticadas: sessão obrigatória (o nome "(auth)" aqui significa "área autenticada",
 * não o fluxo de login — login/register ficam fora deste grupo).
 */
import { HeaderRight } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { RN_THEME } from "@/lib/rnThemeColors";
import { Redirect, Stack } from "expo-router";
import React from "react";

const stackScreenOptions = {
  headerStyle: { backgroundColor: RN_THEME.elevated },
  headerTintColor: RN_THEME.fg,
  headerTitleStyle: { fontWeight: "700" as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: RN_THEME.canvas },
};

export default function AuthenticatedLayout() {
  const { user, sessionHydrated } = useAuth();

  if (!sessionHydrated) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        ...stackScreenOptions,
        headerTitle: "Shingeki",
        headerRight: () => <HeaderRight />,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="projects/[id]"
        options={{
          headerTitle: "Project",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="systems/[id]"
        options={{
          headerTitle: "System",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
