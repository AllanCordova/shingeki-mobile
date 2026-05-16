import { ErrorMessages } from "@/components/ui/ErrorMessages";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type FormField = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

type FormModalProps = {
  visible: boolean;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, string>;
  submitLabel?: string;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
};

export function FormModal({
  visible,
  title,
  fields,
  initialValues = {},
  submitLabel = "Save",
  isSubmitting = false,
  error,
  onClose,
  onSubmit,
}: FormModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      const defaults: Record<string, string> = {};
      for (const field of fields) {
        defaults[field.key] = initialValues[field.key] ?? "";
      }
      setValues(defaults);
    }
  }, [visible]);

  const handleChange = (key: string, text: string) => {
    setValues((prev) => ({ ...prev, [key]: text }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center bg-black/60 px-5">
          <Pressable
            className="absolute inset-0"
            onPress={onClose}
            accessibilityLabel="Close modal"
          />
          <View className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-elevated">
            <View className="flex-row items-center justify-between border-b border-border-subtle px-5 py-4">
              <Text className="text-lg font-bold text-fg">{title}</Text>
              <Pressable onPress={onClose} hitSlop={12} className="active:opacity-70">
                <MaterialIcons name="close" size={24} color={RN_THEME.fgMuted} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              className="max-h-96 px-5 py-4"
            >
              {error ? (
                <View className="mb-2">
                  <ErrorMessages message={error} type="alert" />
                </View>
              ) : null}

              {fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ""}
                  onChangeText={(text) => handleChange(field.key, text)}
                  multiline={field.multiline}
                  numberOfLines={field.multiline ? 4 : 1}
                  editable={!isSubmitting}
                />
              ))}
            </ScrollView>

            <View className="flex-row gap-3 border-t border-border-subtle px-5 py-4">
              <TouchableOpacity
                className="flex-1 rounded-xl border border-border-subtle bg-muted px-4 py-3 active:bg-elevated"
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text className="text-center text-base font-semibold text-fg">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-xl bg-primary-500 px-4 py-3 active:bg-primary-600"
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loading size="small" color={RN_THEME.onAccent} />
                ) : (
                  <Text className="text-center text-base font-bold text-gray-950">
                    {submitLabel}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
