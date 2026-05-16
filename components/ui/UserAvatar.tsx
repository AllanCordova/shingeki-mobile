import { RN_THEME } from "@/lib/rnThemeColors";
import { resolveStorageUrl } from "@/lib/urls";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, View } from "react-native";

type UserAvatarProps = {
  iconPath?: string | null;
  size?: number;
};

export function UserAvatar({ iconPath, size = 36 }: UserAvatarProps) {
  const avatarUrl = resolveStorageUrl(iconPath ?? null);
  const borderRadius = size / 2;

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        resizeMode="cover"
        style={{ width: size, height: size, borderRadius }}
        className="border border-border-subtle bg-muted"
      />
    );
  }

  return (
    <View
      className="items-center justify-center border border-border-subtle bg-muted"
      style={{ width: size, height: size, borderRadius }}
    >
      <MaterialIcons
        name="person"
        size={Math.round(size * 0.55)}
        color={RN_THEME.fgSubtle}
      />
    </View>
  );
}
