import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useAuth } from "@/hooks/useAuth";
import useIsRoot from "@/hooks/useIsRoot";
import { theme } from "../constants/theme";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();
  const { fetchMe, user, logout } = useAuth();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const isRoot = useIsRoot();

  return (
    <>
      <Stack
        screenOptions={{
          headerTitle: "Shingeki",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: {
            color: theme.colors.onSurface,
          },
          headerTintColor: theme.colors.onSurface,
          headerLeft: isRoot ? () => <></> : undefined,
          headerRight: () => {
            if (user) {
              return (
                <View className="flex-row items-center gap-3">
                  <Text className="font-label text-sm text-on-surface">
                    {user.name}
                  </Text>
                  <Pressable
                    onPress={async () => {
                      await logout();
                      Toast.show({ type: "success", text1: "Logged out" });
                      router.push("/");
                    }}
                  >
                    <MaterialIcons
                      name="logout"
                      size={18}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                </View>
              );
            }

            return (
              <Pressable onPress={() => router.push("./login")}>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons
                    name="person-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text className="font-label text-xs uppercase tracking-[1.5px] text-primary">
                    Login
                  </Text>
                </View>
              </Pressable>
            );
          },
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen
          name="login/index"
          options={{
            headerTitle: "Login",
          }}
        />
      </Stack>
      <Toast />
    </>
  );
}
