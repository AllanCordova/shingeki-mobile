import { FormModal } from "@/components/ui/FormModal";
import { useProject } from "@/hooks/useProject";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { ErrorMessages } from "../ui/ErrorMessages";
import { Loading } from "../ui/Loading";
import { CardProject } from "./CardProject";
import { PROJECT_FORM_FIELDS } from "./projectFormFields";

const CARD_WIDTH = 280;

export function ProjectsCarousel() {
  const router = useRouter();
  const [createVisible, setCreateVisible] = useState(false);

  const {
    Project,
    isLoading,
    error,
    submitError,
    isSubmitting,
    getAllProjects,
    createProject,
    clearSubmitError,
  } = useProject();

  useFocusEffect(
    useCallback(() => {
      getAllProjects();
    }, [getAllProjects]),
  );

  const openCreateModal = () => {
    clearSubmitError();
    setCreateVisible(true);
  };

  const closeCreateModal = () => {
    setCreateVisible(false);
  };

  const handleCreateSubmit = async (values: Record<string, string>) => {
    const ok = await createProject({
      name: values.name ?? "",
      description: values.description ?? "",
    });
    if (ok) {
      closeCreateModal();
    }
  };

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-fg">Your projects</Text>
        <Link href="/projects" asChild>
          <Pressable hitSlop={8} className="active:opacity-70">
            <Text className="text-sm font-semibold text-primary-400">
              See all
            </Text>
          </Pressable>
        </Link>
      </View>

      {isLoading ? (
        <View className="items-center py-10">
          <Loading />
        </View>
      ) : error ? (
        <ErrorMessages message={error} type="alert" />
      ) : !Project || Project.length === 0 ? (
        <View className="items-center rounded-2xl border border-dashed border-border bg-elevated px-6 py-8">
          <Text className="text-center text-base font-semibold text-fg">
            No projects yet
          </Text>
          <Text className="mt-2 text-center text-sm leading-relaxed text-fg-muted">
            Create your first project to organize systems and scans.
          </Text>
          <Pressable
            className="mt-5 rounded-xl bg-primary-500 px-5 py-3 active:bg-primary-600"
            onPress={openCreateModal}
          >
            <Text className="text-center text-sm font-bold text-gray-950">
              New project
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          horizontal
          data={Project}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH, minHeight: 272 }}>
              <CardProject
                project={item}
                onPress={() => router.push(`/projects/${item.id}` as Href)}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View className="w-3" />}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      )}

      <FormModal
        visible={createVisible}
        title="New project"
        fields={PROJECT_FORM_FIELDS}
        submitLabel="Create"
        isSubmitting={isSubmitting}
        error={submitError}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
      />
    </View>
  );
}
