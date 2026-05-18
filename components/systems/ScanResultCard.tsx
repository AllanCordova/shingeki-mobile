import {
  getFriendlyPresentation,
  getTechnicalRows,
  type ResultViewMode,
} from "@/lib/scanResultPresentation";
import { RN_THEME } from "@/lib/rnThemeColors";
import type { SecurityLevel, SystemResult } from "@/schemas/systemResult";
import { MaterialIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

const LEVEL_STYLES: Record<
  SecurityLevel,
  { label: string; chip: string; text: string; icon: IconName }
> = {
  LOW: {
    label: "Low",
    chip: "border-success-700 bg-success-50",
    text: "text-success-600",
    icon: "info",
  },
  MEDIUM: {
    label: "Medium",
    chip: "border-warning-600 bg-warning-50",
    text: "text-warning-600",
    icon: "warning",
  },
  HIGH: {
    label: "High",
    chip: "border-error-200 bg-error-50",
    text: "text-error-300",
    icon: "error",
  },
};

type ScanResultCardProps = {
  result: SystemResult;
  viewMode: ResultViewMode;
  width: number;
};

function SeverityChip({ level }: { level: SecurityLevel }) {
  const style = LEVEL_STYLES[level];
  return (
    <View
      className={`shrink-0 flex-row items-center gap-1 rounded-full border px-2.5 py-1 ${style.chip}`}
    >
      <MaterialIcons name={style.icon} size={14} color={RN_THEME.fg} />
      <Text className={`text-[10px] font-bold uppercase ${style.text}`}>
        {style.label}
      </Text>
    </View>
  );
}

export function ScanResultCard({
  result,
  viewMode,
  width,
}: ScanResultCardProps) {
  const level = LEVEL_STYLES[result.security_lvl];
  const friendly = getFriendlyPresentation(result);

  return (
    <View
      style={{ width }}
      className="rounded-2xl border border-border bg-muted p-4"
    >
      <View className="flex-row items-start justify-between gap-3">
        <Text
          className="min-w-0 flex-1 text-base font-bold text-fg"
          numberOfLines={2}
        >
          {viewMode === "friendly"
            ? friendly.title
            : result.attack?.category?.replace(/_/g, " ") ?? "Finding"}
        </Text>
        <SeverityChip level={result.security_lvl} />
      </View>

      <View className="mt-3 flex-row items-center gap-1.5">
        <MaterialIcons name="link" size={14} color={RN_THEME.fgSubtle} />
        <Text
          className="min-w-0 flex-1 text-xs text-fg-muted"
          numberOfLines={2}
          ellipsizeMode="middle"
        >
          {friendly.routeLabel}
        </Text>
      </View>

      {viewMode === "friendly" ? (
        <View className="mt-4 gap-3">
          <View className="rounded-xl border border-primary-700/50 bg-primary-950/40 px-3 py-3">
            <Text className="text-xs font-semibold uppercase text-primary-400">
              {friendly.levelLabel}
            </Text>
            <Text className="mt-1 text-sm leading-relaxed text-fg">
              {friendly.levelHint}
            </Text>
          </View>

          <Text className="text-sm leading-relaxed text-fg-muted">
            {friendly.summary}
          </Text>

          <View className="flex-row gap-2">
            <MaterialIcons
              name="place"
              size={16}
              color={RN_THEME.accent}
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-sm text-fg-muted">
              Found {friendly.where}.
            </Text>
          </View>

          <View className="rounded-xl bg-elevated px-3 py-3">
            <Text className="text-xs font-semibold text-fg-subtle">
              What the test observed
            </Text>
            <Text className="mt-1 text-sm leading-relaxed text-fg">
              {friendly.evidenceExplain}
            </Text>
          </View>
        </View>
      ) : (
        <View className="mt-4 gap-3">
          {getTechnicalRows(result).map((row) => (
            <View key={row.label}>
              <Text className="text-[10px] font-semibold uppercase text-fg-subtle">
                {row.label}
              </Text>
              <Text
                className="mt-1 font-mono text-xs leading-relaxed text-fg"
                selectable
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className="mt-4 flex-row items-center gap-1 border-t border-border-subtle pt-3">
        <MaterialIcons
          name={viewMode === "friendly" ? "visibility" : "code"}
          size={14}
          color={RN_THEME.fgSubtle}
        />
        <Text className="text-[10px] text-fg-subtle">
          {viewMode === "friendly"
            ? "Simplified view"
            : `Severity ${level.label}`}
        </Text>
      </View>
    </View>
  );
}
