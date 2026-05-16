import { HeaderRight } from "@/components/ui";
import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: RN_THEME.elevated },
        headerTintColor: RN_THEME.fg,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: RN_THEME.canvas },
        headerRight: () => <HeaderRight />,
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
