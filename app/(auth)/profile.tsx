import { useAuth } from "@/hooks/useAuth";
import { Link, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-canvas" keyboardShouldPersistTaps="handled">
      <View className="border-b border-border-subtle bg-elevated px-5 pb-6 pt-4">
        <Text className="text-2xl font-black text-fg">Profile</Text>
        <Text className="mt-1 text-sm text-fg-muted">
          Signed-in workspace identity (test screen).
        </Text>
      </View>

      <View className="px-5 py-6">
        <View className="card mb-5 border-border">
          <Text className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Name
          </Text>
          <Text className="mt-1 text-lg font-semibold text-fg">
            {user?.name ?? "—"}
          </Text>
          <Text className="mt-5 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Email
          </Text>
          <Text className="mt-1 text-lg font-semibold text-fg">
            {user?.email ?? "—"}
          </Text>
        </View>

        <TouchableOpacity
          className="mb-3 rounded-xl border border-border-subtle bg-muted px-5 py-3.5 active:bg-elevated"
          onPress={() => router.back()}
        >
          <Text className="text-center text-base font-semibold text-fg">
            Back
          </Text>
        </TouchableOpacity>

        <Link href="/" asChild>
          <TouchableOpacity className="rounded-xl bg-primary-500 px-5 py-3.5 active:bg-primary-600">
            <Text className="text-center text-base font-bold text-gray-950">
              Home
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
