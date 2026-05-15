import { Background, HeaderAction } from "@/components/ui";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { RN_THEME } from "@/lib/rnThemeColors";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import "../global.css";

const NAV_THEME = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: RN_THEME.accent,
    background: "transparent",
    card: RN_THEME.elevated,
    text: RN_THEME.fg,
    border: "#2a3544",
    notification: DarkTheme.colors.notification,
  },
};

const headerScreenOptions = {
  headerStyle: { backgroundColor: RN_THEME.elevated },
  headerTintColor: RN_THEME.fg,
  headerTitleStyle: { fontWeight: "700" as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: "transparent" },
};

export default function RootLayout() {
  const sessionHydrated = useAuth((s) => s.sessionHydrated);
  const user = useAuth((s) => s.user);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    void useAuth.getState().hydrateSession();
  }, []);

  useEffect(() => {
    if (!sessionHydrated) return;
    const onLogin = pathname === "/login" || pathname.startsWith("/login/");
    const onRegister =
      pathname === "/register" || pathname.startsWith("/register/");
    if (user && (onLogin || onRegister)) {
      router.replace("/");
    }
  }, [sessionHydrated, user, pathname, router]);

  return (
    <ThemeProvider value={NAV_THEME}>
      <StatusBar style="light" />
      <View className="flex-1">
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: RN_THEME.canvas },
          ]}
        />
        <Background />
        {!sessionHydrated ? (
          <Loading fullScreen />
        ) : (
          <Stack
            screenOptions={{ ...headerScreenOptions, headerTitle: "Shingeki" }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen
              name="login/index"
              options={{
                headerTitle: "Login",
                headerRight: () => (
                  <View className="flex-row items-center gap-3 pr-1">
                    <HeaderAction
                      href="/register"
                      label="Register"
                      icon="person-add"
                      variant="primary"
                    />
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="register/index"
              options={{
                headerTitle: "Register",
                headerRight: () => (
                  <View className="flex-row items-center gap-3 pr-1">
                    <HeaderAction href="/login" label="Login" icon="login" />
                  </View>
                ),
              }}
            />
          </Stack>
        )}
      </View>
    </ThemeProvider>
  );
}
