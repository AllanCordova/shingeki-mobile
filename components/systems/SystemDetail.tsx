import { RN_THEME } from "@/lib/rnThemeColors";
import { SystemCoverImage } from "@/components/systems/SystemCoverImage";
import { System } from "@/schemas/system";
import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type SystemDetailProps = {
  system: System;
  onDelete?: () => void;
  isDeleting?: boolean;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View className="mt-4">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name={icon} size={18} color={RN_THEME.fgSubtle} />
        <Text className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
          {label}
        </Text>
      </View>
      <Text className="mt-1 text-sm font-medium text-fg">{value}</Text>
    </View>
  );
}

export function SystemDetail({
  system,
  onDelete,
  isDeleting = false,
}: SystemDetailProps) {
  return (
    <View className="bg-canvas">
      <SystemCoverImage system={system} variant="banner" />

      <View className="px-5 py-6">
        <Text className="text-2xl font-black text-fg">{system.name}</Text>

        <View className="mt-6 rounded-2xl border border-border bg-elevated p-4">
          <InfoRow
            icon="link"
            label="Target URL"
            value={system.target_url ?? "Not set"}
          />
          <InfoRow
            icon="code"
            label="Repository URL"
            value={system.repository_url ?? "Not set"}
          />
          <InfoRow
            icon="schedule"
            label="Created at"
            value={formatDate(system.created_at)}
          />
          <InfoRow
            icon="update"
            label="Updated at"
            value={formatDate(system.updated_at)}
          />
        </View>

        {onDelete ? (
          <Pressable
            onPress={onDelete}
            disabled={isDeleting}
            className="mt-8 flex-row items-center justify-center gap-2 rounded-xl border border-error-200 bg-error-50 px-5 py-3.5 active:opacity-70"
          >
            <MaterialIcons name="delete" size={20} color={RN_THEME.error} />
            <Text className="text-base font-semibold text-error-300">
              {isDeleting ? "Deleting..." : "Delete system"}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
