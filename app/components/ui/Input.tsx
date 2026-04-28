import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";
import { Text, TextInput, View } from "react-native";

type InputProps = TextInputProps & {
  label: string;
  error?: string | null;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
};

export function Input({
  label,
  error,
  leftElement,
  rightElement,
  containerClassName = "",
  inputClassName = "",
  ...props
}: InputProps) {
  return (
    <View className={containerClassName}>
      <Text className="mb-2 ml-1 text-[11px] uppercase tracking-[2px] text-outline">
        {label}
      </Text>

      <View className="flex-row items-center border border-outline-variant bg-surface-container-lowest px-3">
        {leftElement}

        <TextInput
          placeholderTextColor="#958ea0"
          className={`h-12 flex-1 px-3 text-sm text-on-surface ${inputClassName}`}
          {...props}
        />

        {rightElement}
      </View>

      {error ? (
        <Text className="mt-2 px-1 text-xs text-error">{error}</Text>
      ) : null}
    </View>
  );
}
