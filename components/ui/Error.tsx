import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface ErrorProps {
  message?: string | null;
  visible?: boolean;
  type?: "inline" | "alert" | "banner";
}

export const Error: React.FC<ErrorProps> = ({
  message,
  visible = true,
  type = "inline",
}) => {
  if (!visible || !message) return null;

  if (type === "inline") {
    return (
      <View className="flex-row items-center gap-2 rounded-xl border border-error-200 bg-error-50 px-3 py-2">
        <MaterialIcons name="error" size={16} color={RN_THEME.error} />
        <Text className="text-error-300 text-sm font-medium flex-1">
          {message}
        </Text>
      </View>
    );
  }

  if (type === "alert") {
    return (
      <View className="mb-4 flex-row items-center gap-3 rounded-xl border border-error-200 bg-error-50 px-4 py-3">
        <MaterialIcons name="warning" size={20} color={RN_THEME.error} />
        <Text className="text-error-300 text-sm font-medium flex-1">
          {message}
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full flex-row items-center justify-between border-b border-error-600 bg-error-100 px-4 py-3">
      <View className="flex-row items-center gap-2 flex-1">
        <MaterialIcons name="close" size={20} color={RN_THEME.onErrorSurface} />
        <Text className="text-error-300 text-sm font-semibold flex-1">
          {message}
        </Text>
      </View>
    </View>
  );
};
