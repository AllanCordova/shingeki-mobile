import { RN_THEME } from "@/lib/rnThemeColors";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  type?: "email" | "password" | "text";
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  type = "text",
  editable = true,
  multiline = false,
  numberOfLines = 1,
}) => {
  const getInputType = () => {
    switch (type) {
      case "email":
        return "email-address";
      case "password":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-fg-muted mb-2">{label}</Text>
      <TextInput
        className={`px-4 py-3 rounded-xl border font-normal text-base text-fg ${
          error ? "border-error-400 bg-error-50" : "border-border bg-input"
        }`}
        placeholder={placeholder}
        placeholderTextColor={RN_THEME.fgSubtle}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={type === "password"}
        keyboardType={getInputType()}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={type === "email" ? "none" : "sentences"}
      />
      {error && (
        <Text className="text-error-300 text-xs font-medium mt-1">{error}</Text>
      )}
    </View>
  );
};
