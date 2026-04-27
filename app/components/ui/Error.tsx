import { View, Text } from "react-native";

export default function Error({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <View className="items-center justify-center rounded-sm border border-error/30 bg-error-container/20 px-3 py-2">
      <Text className="text-center text-xs text-error">{error}</Text>
    </View>
  );
}
