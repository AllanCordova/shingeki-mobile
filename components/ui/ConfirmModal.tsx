import { Loading } from "@/components/ui/Loading";
import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center bg-black/60 px-5">
        <Pressable
          className="absolute inset-0"
          onPress={onCancel}
          disabled={isLoading}
          accessibilityLabel="Close confirmation"
        />

        <View className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-elevated">
          <View className="items-center px-5 pb-2 pt-6">
            <View className="mb-4 rounded-full bg-error-50 p-3">
              <MaterialIcons name="warning" size={28} color={RN_THEME.error} />
            </View>
            <Text className="text-center text-lg font-bold text-fg">{title}</Text>
            <Text className="mt-2 text-center text-base leading-relaxed text-fg-muted">
              {message}
            </Text>
          </View>

          <View className="flex-row gap-3 px-5 py-5">
            <TouchableOpacity
              className="flex-1 rounded-xl border border-border-subtle bg-muted px-4 py-3 active:bg-elevated"
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text className="text-center text-base font-semibold text-fg">
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 rounded-xl border border-error-200 bg-error-50 px-4 py-3 active:opacity-80"
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading size="small" color={RN_THEME.error} />
              ) : (
                <Text className="text-center text-base font-bold text-error-300">
                  {confirmLabel}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
