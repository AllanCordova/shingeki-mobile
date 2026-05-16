import { RN_THEME } from "@/lib/rnThemeColors";
import { resolveStorageUrl } from "@/lib/urls";
import { Project } from "@/schemas/project";
import { SystemCoverImage } from "@/components/systems/SystemCoverImage";
import { System } from "@/schemas/system";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ErrorMessages } from "../ui/ErrorMessages";
import { Loading } from "../ui/Loading";

type ProjectDetailProps = {
  project: Project;
  systems?: System[];
  systemsLoading?: boolean;
  systemsError?: string | null;
  onSystemPress?: (systemId: string) => void;
  onEditSystem?: (systemId: string) => void;
  onAddSystem?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function ProjectDetail({
  project,
  systems = [],
  systemsLoading = false,
  systemsError = null,
  onSystemPress,
  onEditSystem,
  onAddSystem,
  onDelete,
  isDeleting = false,
}: ProjectDetailProps) {
  const coverUrl = resolveStorageUrl(project.cover_path);

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="h-52 w-full bg-muted">
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            resizeMode="cover"
            className="h-full w-full"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <MaterialIcons name="folder" size={72} color={RN_THEME.fgSubtle} />
          </View>
        )}
      </View>

      <View className="px-5 py-6">
        <Text className="text-2xl font-black text-fg">{project.name}</Text>

        {project.description ? (
          <Text className="mt-3 text-base leading-relaxed text-fg-muted">
            {project.description}
          </Text>
        ) : (
          <Text className="mt-3 text-base italic text-fg-subtle">
            No description
          </Text>
        )}

        <View className="mt-6 rounded-2xl border border-border bg-elevated p-4">
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="schedule"
              size={18}
              color={RN_THEME.fgSubtle}
            />
            <Text className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              Created at
            </Text>
          </View>
          <Text className="mt-1 text-sm font-medium text-fg">
            {formatDate(project.created_at)}
          </Text>

          <View className="mt-4 flex-row items-center gap-2">
            <MaterialIcons name="update" size={18} color={RN_THEME.fgSubtle} />
            <Text className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              Updated at
            </Text>
          </View>
          <Text className="mt-1 text-sm font-medium text-fg">
            {formatDate(project.updated_at)}
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
            Systems
          </Text>

          {systemsLoading ? (
            <View className="mt-3 py-4">
              <Loading />
            </View>
          ) : systemsError ? (
            <View className="mt-3">
              <ErrorMessages message={systemsError} type="alert" />
            </View>
          ) : systems.length === 0 ? (
            <Text className="mt-3 text-sm text-fg-muted">
              No systems registered for this project.
            </Text>
          ) : (
            <View className="mt-3 gap-2">
              {systems.map((system) => (
                <View
                  key={system.id}
                  className="flex-row items-center gap-2 rounded-xl border border-border bg-elevated p-3"
                >
                  <Pressable
                    onPress={
                      onSystemPress ? () => onSystemPress(system.id) : undefined
                    }
                    disabled={!onSystemPress}
                    className={`min-w-0 flex-1 flex-row items-center gap-3 ${
                      onSystemPress ? "active:opacity-80" : ""
                    }`}
                  >
                    <SystemCoverImage system={system} variant="thumbnail" />

                    <View className="min-w-0 flex-1">
                      <Text
                        className="text-base font-semibold text-fg"
                        numberOfLines={1}
                      >
                        {system.name}
                      </Text>
                      {system.target_url ? (
                        <Text
                          className="mt-0.5 text-sm text-fg-muted"
                          numberOfLines={1}
                        >
                          {system.target_url}
                        </Text>
                      ) : null}
                    </View>

                    {onSystemPress ? (
                      <MaterialIcons
                        name="chevron-right"
                        size={22}
                        color={RN_THEME.fgSubtle}
                      />
                    ) : null}
                  </Pressable>

                  {onEditSystem ? (
                    <Pressable
                      testID={`system-edit-${system.id}`}
                      onPress={() => onEditSystem(system.id)}
                      hitSlop={8}
                      className="rounded-lg p-2 active:bg-muted"
                    >
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={RN_THEME.accent}
                      />
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {onAddSystem && !systemsLoading && !systemsError ? (
            <Pressable
              onPress={onAddSystem}
              className="mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted px-4 py-3 active:bg-elevated"
            >
              <MaterialIcons name="add" size={20} color={RN_THEME.accent} />
              <Text className="text-sm font-semibold text-primary-400">
                Add system
              </Text>
            </Pressable>
          ) : null}
        </View>

        {onDelete ? (
          <Pressable
            onPress={onDelete}
            disabled={isDeleting}
            className="mt-8 flex-row items-center justify-center gap-2 rounded-xl border border-error-200 bg-error-50 px-5 py-3.5 active:opacity-70"
          >
            <MaterialIcons name="delete" size={20} color={RN_THEME.error} />
            <Text className="text-base font-semibold text-error-300">
              {isDeleting ? "Deleting..." : "Delete project"}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}
