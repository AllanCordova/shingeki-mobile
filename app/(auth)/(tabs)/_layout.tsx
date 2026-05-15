import { HeaderAction } from "@/components/ui";
import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs, type Href } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: RN_THEME.elevated },
        headerTintColor: RN_THEME.fg,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: RN_THEME.canvas },
        tabBarStyle: {
          backgroundColor: RN_THEME.elevated,
          borderTopColor: RN_THEME.canvas,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: RN_THEME.accent,
        tabBarInactiveTintColor: RN_THEME.fgMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          headerTitle: "Shingeki",
          headerRight: () => (
            <View className="flex-row items-center gap-2 pr-1">
              <HeaderAction
                href={"/profile" as Href}
                label="Profile"
                icon="person"
                variant="ghost"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scans"
        options={{
          title: "Scans",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="security" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="code"
        options={{
          title: "Code",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="code" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assessment" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder-special" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
