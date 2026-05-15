import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

type ComingSoonProps = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
};

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <ScrollView className="flex-1 bg-canvas">
      <View className="min-h-full grow px-5 py-8">
        <View className="items-center rounded-2xl border border-dashed border-border bg-elevated px-6 py-12">
        <View className="mb-4 rounded-full bg-muted p-4">
          <MaterialIcons name={icon} size={40} color={RN_THEME.accent} />
        </View>
        <Text className="text-center text-xs font-bold uppercase tracking-widest text-primary-400">
          Coming soon
        </Text>
        <Text className="mt-2 text-center text-2xl font-black text-fg">{title}</Text>
        <Text className="mt-3 text-center text-base leading-relaxed text-fg-muted">
          {description}
        </Text>
        </View>
      </View>
    </ScrollView>
  );
}
