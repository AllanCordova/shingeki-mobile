import { ScanResultCard } from "@/components/systems/ScanResultCard";
import type { ResultViewMode } from "@/lib/scanResultPresentation";
import { RN_THEME } from "@/lib/rnThemeColors";
import type { SystemResult } from "@/schemas/systemResult";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import { Loading } from "../ui/Loading";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_GAP = 12;
/** section px-4 (16) + parent px-5 (20) on each side */
const SIDE_INSET = (16 + 20) * 2;
const CARD_WIDTH = SCREEN_WIDTH - SIDE_INSET;

type SystemResultsListProps = {
  results: SystemResult[];
  isLoading: boolean;
};

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ResultViewMode;
  onChange: (mode: ResultViewMode) => void;
}) {
  return (
    <View className="flex-row rounded-xl border border-border bg-canvas p-1">
      <Pressable
        onPress={() => onChange("friendly")}
        accessibilityLabel="Simple explanation mode"
        accessibilityRole="button"
        className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2 ${
          mode === "friendly" ? "bg-primary-500" : "active:opacity-70"
        }`}
      >
        <MaterialIcons
          name="school"
          size={16}
          color={mode === "friendly" ? RN_THEME.onAccent : RN_THEME.fgMuted}
        />
        <Text
          className={`text-xs font-semibold ${
            mode === "friendly" ? "text-gray-950" : "text-fg-muted"
          }`}
        >
          Simple
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("technical")}
        accessibilityLabel="Technical information mode"
        accessibilityRole="button"
        className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2 ${
          mode === "technical" ? "bg-primary-500" : "active:opacity-70"
        }`}
      >
        <MaterialIcons
          name="code"
          size={16}
          color={mode === "technical" ? RN_THEME.onAccent : RN_THEME.fgMuted}
        />
        <Text
          className={`text-xs font-semibold ${
            mode === "technical" ? "text-gray-950" : "text-fg-muted"
          }`}
        >
          Technical
        </Text>
      </Pressable>
    </View>
  );
}

export function SystemResultsList({
  results,
  isLoading,
}: SystemResultsListProps) {
  const [viewMode, setViewMode] = useState<ResultViewMode>("friendly");
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP),
      );
      if (index >= 0 && index < results.length) {
        setActiveIndex(index);
      }
    },
    [results.length],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (results.length === 0) {
    return (
      <View className="mt-4 items-center rounded-xl border border-dashed border-border bg-muted px-4 py-6">
        <MaterialIcons name="search-off" size={32} color={RN_THEME.fgSubtle} />
        <Text className="mt-2 text-center text-sm text-fg-muted">
          No results yet. The scan may take a few minutes.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <View className="mb-3 flex-row items-center justify-between gap-2">
        <Text className="text-sm font-bold text-fg">
          Results ({results.length})
        </Text>
        <Text className="text-xs text-fg-muted">
          {activeIndex + 1} of {results.length}
        </Text>
      </View>

      <ViewModeToggle mode={viewMode} onChange={setViewMode} />

      <Text className="mt-2 text-xs text-fg-subtle">
        {viewMode === "friendly"
          ? "Clear explanations for people without a security background."
          : "Raw scan data: routes, payloads, and evidence."}
      </Text>

      <FlatList
        data={results}
        key={`${viewMode}-${results.length}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment="start"
        contentContainerStyle={{ paddingTop: 12, paddingRight: CARD_GAP }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <ScanResultCard
            result={item}
            viewMode={viewMode}
            width={CARD_WIDTH}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <View className="mt-3 flex-row items-center justify-center gap-1.5">
        {results.map((r, i) => (
          <View
            key={r.id}
            className={`h-1.5 rounded-full ${
              i === activeIndex ? "w-5 bg-primary-400" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
