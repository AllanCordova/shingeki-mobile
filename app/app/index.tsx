import { Text, View } from "react-native";
import "../global.css";
import { useAuth } from "@/hooks/useAuth";

export default function App() {
  const { user } = useAuth();

  return (
    <View className="flex-1 bg-background px-6 py-8">
      <View className="absolute -left-16 top-20 h-56 w-56 rounded-full bg-primary-container/20" />
      <View className="absolute -right-20 bottom-24 h-64 w-64 rounded-full bg-secondary-container/20" />

      <View className="mt-10 bg-surface-container p-6">
        <Text className="font-headline text-3xl font-bold text-on-surface">
          Shingeki
        </Text>
        <Text className="mt-2 text-sm text-on-surface-variant">
          {user
            ? `Welcome, ${user.name}`
            : "Cyber-sentinel workspace initialized."}
        </Text>
      </View>

      <View className="mt-6 bg-surface-container-high p-6">
        <Text className="font-label text-[11px] uppercase tracking-[2px] text-outline">
          Threat Pulse
        </Text>
        <View className="mt-3 flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="text-sm text-on-surface">
            System monitoring active
          </Text>
        </View>
      </View>
    </View>
  );
}
