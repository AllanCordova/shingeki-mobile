import { ProjectsCarousel } from "@/components/projects";
import { useAuth } from "@/hooks/useAuth";
import { ScrollView, Text, View } from "react-native";

export default function HomeTab() {
  const { user } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="overflow-hidden rounded-b-3xl">
        <View
          className="min-h-[200px] px-5 pb-10 pt-4"
          style={{ backgroundColor: "rgba(7, 11, 18, 0.55)" }}
        >
          <View className="self-start rounded-full border border-primary-700 bg-primary-950 px-3 py-1">
            <Text className="text-[10px] font-bold uppercase tracking-widest text-primary-300">
              Application security
            </Text>
          </View>
          <Text className="mt-4 text-3xl font-black leading-tight text-fg">
            Ship with confidence
          </Text>
          <Text className="mt-2 max-w-sm text-base leading-relaxed text-fg-muted">
            DAST, SAST, and reporting in one place — built for teams who need
            proof, not noise.
          </Text>
          <View className="mt-5 flex-row flex-wrap gap-2">
            <View className="rounded-xl bg-muted px-3 py-2">
              <Text className="text-[10px] font-semibold uppercase text-fg-subtle">
                Signed in as
              </Text>
              <Text className="text-sm font-semibold text-fg" numberOfLines={1}>
                {user?.name}
              </Text>
            </View>
            <View className="rounded-xl bg-muted px-3 py-2">
              <Text className="text-[10px] font-semibold uppercase text-fg-subtle">
                Health score
              </Text>
              <Text className="text-sm font-bold text-primary-300">—</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-6 px-4">
        <ProjectsCarousel />
      </View>

      <View className="mt-6 px-4">
        <View className="rounded-2xl border border-secondary-700 bg-secondary-950 p-5">
          <Text className="text-xs font-bold uppercase tracking-widest text-secondary-300">
            Advanced
          </Text>
          <Text className="mt-2 text-lg font-bold text-fg">Manual toolkit</Text>
          <Text className="mt-2 text-sm leading-relaxed text-fg-muted">
            Intercept requests, tweak headers and payloads, map routes — built
            for pentesters who still want a UI. Coming in a future release.
          </Text>
        </View>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}
