import { useAuth } from "@/hooks/useAuth";
import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter, type Href } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

type FeatureCardProps = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  body: string;
  href: Href;
};

function FeatureCard({ icon, title, body, href }: FeatureCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable className="mb-3 w-[47%] rounded-2xl border border-border bg-elevated p-4 active:bg-muted">
        <MaterialIcons name={icon} size={26} color={RN_THEME.accent} />
        <Text className="mt-2 text-base font-bold text-fg">{title}</Text>
        <Text className="mt-1 text-xs leading-relaxed text-fg-muted">
          {body}
        </Text>
        <Text className="mt-2 text-xs font-semibold text-primary-300">
          Open tab →
        </Text>
      </Pressable>
    </Link>
  );
}

export default function HomeTab() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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

      <View className="mt-4 px-4">
        <View className="rounded-2xl border border-primary-700 bg-primary-950 px-4 py-4 shadow-lg">
          <View className="flex-row items-start gap-3">
            <View className="flex-1">
              <Text className="text-base font-bold text-fg">
                Start when you are ready
              </Text>
              <Text className="mt-1 text-sm leading-relaxed text-fg-muted">
                Run a controlled scan or connect a repo — flows arrive in the
                Scans and Code tabs.
              </Text>
              <View className="mt-3 flex-row flex-wrap gap-2">
                <TouchableOpacity
                  className="rounded-lg bg-primary-500 px-3 py-2 active:bg-primary-600"
                  onPress={() => router.push("/scans" as Href)}
                >
                  <Text className="text-xs font-bold text-gray-950">
                    Go to Scans
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-lg border border-border bg-muted px-3 py-2 active:bg-elevated"
                  onPress={() => router.push("/code" as Href)}
                >
                  <Text className="text-xs font-bold text-fg">
                    Connect code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-6 px-4">
        <Text className="mb-3 text-lg font-bold text-fg">Quick actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pb-2"
        >
          <View className="flex-row gap-3 px-1">
            <TouchableOpacity
              onPress={() => router.push("/scans" as Href)}
              className="w-40 rounded-2xl border border-border bg-elevated p-4 active:bg-muted"
            >
              <MaterialIcons
                name="travel-explore"
                size={22}
                color={RN_THEME.accent}
              />
              <Text className="mt-2 text-sm font-bold text-fg">Target URL</Text>
              <Text className="mt-1 text-xs text-fg-muted">DAST run</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/code" as Href)}
              className="w-40 rounded-2xl border border-border bg-elevated p-4 active:bg-muted"
            >
              <MaterialIcons
                name="integration-instructions"
                size={22}
                color={RN_THEME.accent}
              />
              <Text className="mt-2 text-sm font-bold text-fg">Repository</Text>
              <Text className="mt-1 text-xs text-fg-muted">SAST link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/reports" as Href)}
              className="w-40 rounded-2xl border border-border bg-elevated p-4 active:bg-muted"
            >
              <MaterialIcons
                name="picture-as-pdf"
                size={22}
                color={RN_THEME.accent}
              />
              <Text className="mt-2 text-sm font-bold text-fg">PDF report</Text>
              <Text className="mt-1 text-xs text-fg-muted">Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/projects" as Href)}
              className="w-40 rounded-2xl border border-border bg-elevated p-4 active:bg-muted"
            >
              <MaterialIcons
                name="view-module"
                size={22}
                color={RN_THEME.accent}
              />
              <Text className="mt-2 text-sm font-bold text-fg">Workspaces</Text>
              <Text className="mt-1 text-xs text-fg-muted">Projects</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View className="mt-6 px-4">
        <Text className="mb-3 text-lg font-bold text-fg">What you get</Text>
        <View className="flex-row flex-wrap justify-between gap-y-3">
          <FeatureCard
            href="/scans"
            icon="security"
            title="Controlled failures"
            body="See impact visually in a safe harness before attackers do."
          />
          <FeatureCard
            href="/code"
            icon="account-tree"
            title="Architecture signals"
            body="Static analysis mapped to your stack and repos."
          />
          <FeatureCard
            href="/reports"
            icon="trending-up"
            title="Score & proof"
            body="Health score plus history to show remediation over time."
          />
          <FeatureCard
            href="/projects"
            icon="lock-open"
            title="Scoped workspaces"
            body="Separate apps, hooks for homolog CI, and clean ownership."
          />
        </View>
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
