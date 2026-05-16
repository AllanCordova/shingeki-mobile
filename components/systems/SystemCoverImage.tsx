import { RN_THEME } from "@/lib/rnThemeColors";
import { resolveSystemCoverUrl } from "@/lib/urls";
import { System } from "@/schemas/system";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

const THUMB_SIZE = 56;
const BANNER_HEIGHT = 208;

type SystemCoverImageProps = {
  system: Pick<System, "cover_url" | "cover_path">;
  variant?: "thumbnail" | "banner";
};

export function SystemCoverImage({
  system,
  variant = "thumbnail",
}: SystemCoverImageProps) {
  const uri = resolveSystemCoverUrl(system);

  if (variant === "banner") {
    return (
      <View className="h-52 w-full bg-muted">
        {uri ? (
          <Image
            source={{ uri }}
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <View
            className="items-center justify-center bg-muted"
            style={{ height: BANNER_HEIGHT }}
          >
            <MaterialIcons name="dns" size={72} color={RN_THEME.fgSubtle} />
          </View>
        )}
      </View>
    );
  }

  return (
    <View
      className="overflow-hidden rounded-lg bg-muted"
      style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          resizeMode="cover"
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
        />
      ) : (
        <View
          className="items-center justify-center"
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
        >
          <MaterialIcons name="dns" size={28} color={RN_THEME.fgSubtle} />
        </View>
      )}
    </View>
  );
}
