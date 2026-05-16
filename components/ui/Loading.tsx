import { RN_THEME } from "@/lib/rnThemeColors";
import React from "react";
import { ActivityIndicator, View } from "react-native";

interface LoadingProps {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "large",
  color = RN_THEME.accent,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-transparent">
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
      <View className="justify-center items-center py-6">
      <ActivityIndicator testID="loading-indicator" size={size} color={color} />
    </View>
  );
};
