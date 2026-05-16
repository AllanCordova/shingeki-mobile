import { useToast, type ToastItem, type ToastType } from "@/hooks/useToast";
import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function toastStyles(type: ToastType) {
  switch (type) {
    case "success":
      return {
        container: "border-primary-700 bg-primary-950",
        icon: "check-circle" as const,
        iconColor: RN_THEME.accent,
        text: "text-fg",
      };
    case "error":
      return {
        container: "border-error-200 bg-error-50",
        icon: "error" as const,
        iconColor: RN_THEME.error,
        text: "text-error-300",
      };
    default:
      return {
        container: "border-border bg-elevated",
        icon: "info" as const,
        iconColor: RN_THEME.accent,
        text: "text-fg",
      };
  }
}

function ToastCard({
  toast: item,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const styles = toastStyles(item.type);

  return (
    <Pressable
      onPress={onDismiss}
      className={`mb-2 flex-row items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${styles.container}`}
    >
      <MaterialIcons name={styles.icon} size={22} color={styles.iconColor} />
      <Text className={`flex-1 text-sm font-medium leading-snug ${styles.text}`}>
        {item.message}
      </Text>
      <MaterialIcons name="close" size={18} color={RN_THEME.fgSubtle} />
    </Pressable>
  );
}

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const toasts = useToast((state) => state.toasts);
  const dismiss = useToast((state) => state.dismiss);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 z-50 px-4"
      style={{ top: insets.top + 8 }}
    >
      {toasts.map((item) => (
        <ToastCard
          key={item.id}
          toast={item}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </View>
  );
}
