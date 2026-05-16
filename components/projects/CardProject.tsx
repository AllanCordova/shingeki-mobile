import { RN_THEME } from "@/lib/rnThemeColors";
import { resolveStorageUrl } from "@/lib/urls";
import { Project } from "@/schemas/project";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

type CardProjectProps = {
  project: Project;
  onPress?: () => void;
  onDelete?: () => void;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function CardProject({ project, onPress, onDelete }: CardProjectProps) {
  const coverUrl = resolveStorageUrl(project.cover_path);

  const shellClass =
    "relative min-h-[272px] overflow-hidden rounded-2xl border border-border bg-elevated";

  return (
    <View className={`${shellClass} w-full`}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        className={`flex-1 ${onPress ? "active:bg-muted" : ""}`}
      >
        <View className="h-36 w-full bg-muted">
          {coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              resizeMode="cover"
              className="h-full w-full"
            />
          ) : (
            <View className="h-full w-full items-center justify-center">
              <MaterialIcons name="folder" size={48} color={RN_THEME.fgSubtle} />
            </View>
          )}
        </View>

        <View className="min-h-[128px] flex-1 justify-between p-4">
          <View>
            <Text
              className="text-lg font-bold text-fg"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {project.name}
            </Text>

            <Text
              className="mt-1 min-h-[40px] text-sm leading-5 text-fg-muted"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {project.description?.trim() || " "}
            </Text>
          </View>

          <View className="mt-3 flex-row items-center gap-1.5">
            <MaterialIcons name="schedule" size={14} color={RN_THEME.fgSubtle} />
            <Text className="text-xs text-fg-subtle">
              {formatDate(project.created_at)}
            </Text>
          </View>
        </View>
      </Pressable>

      {onDelete ? (
        <Pressable
          testID="project-card-delete"
          onPress={onDelete}
          hitSlop={12}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 active:opacity-70"
        >
          <MaterialIcons name="delete" size={20} color="#f87171" />
        </Pressable>
      ) : null}
    </View>
  );
}
