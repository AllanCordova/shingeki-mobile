import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { FormModal } from "@/components/ui/FormModal";
import { useProject } from "@/hooks/useProject";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { ComingSoon } from "../ui/ComingSoon";
import { ErrorMessages } from "../ui/ErrorMessages";
import { Loading } from "../ui/Loading";
import { CardProject } from "./CardProject";
import { PROJECT_FORM_FIELDS } from "./projectFormFields";

type ProjectsListProps = {
  createModalVisible?: boolean;
  onCreateModalClose?: () => void;
};

export default function ProjectsList({
  createModalVisible = false,
  onCreateModalClose,
}: ProjectsListProps) {
  const router = useRouter();
  const [internalCreateVisible, setInternalCreateVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isCreateVisible = createModalVisible || internalCreateVisible;
  const closeCreateModal = () => {
    onCreateModalClose?.();
    setInternalCreateVisible(false);
  };

  const {
    Project,
    isLoading,
    isDeleting,
    error,
    submitError,
    isSubmitting,
    getAllProjects,
    createProject,
    deleteProject,
    clearSubmitError,
  } = useProject();

  useFocusEffect(
    useCallback(() => {
      getAllProjects();
    }, [getAllProjects]),
  );

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const closeDeleteConfirm = () => {
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const ok = await deleteProject(deleteTarget.id);
    if (ok) {
      closeDeleteConfirm();
    }
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

  const openCreateModal = () => {
    clearSubmitError();
    setInternalCreateVisible(true);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <Loading />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-canvas px-5 py-6">
        <ErrorMessages message={error} type="alert" />
      </View>
    );
  }

  if (!Project || Project.length === 0) {
    return (
      <>
        <View className="flex-1 bg-canvas">
          <ComingSoon
            title="No projects found"
            description="Create your first project to start"
            icon="folder"
          />
          <View className="px-5 pb-8">
            <Pressable
              className="rounded-xl bg-primary-500 px-5 py-3.5 active:bg-primary-600"
              onPress={openCreateModal}
            >
              <Text className="text-center text-base font-bold text-gray-950">
                New Project
              </Text>
            </Pressable>
          </View>
        </View>

        <FormModal
          visible={isCreateVisible}
          title="New project"
          fields={PROJECT_FORM_FIELDS}
          submitLabel="Create"
          isSubmitting={isSubmitting}
          error={submitError}
          onClose={closeCreateModal}
          onSubmit={handleCreateSubmit}
        />

        <ConfirmModal
          visible={!!deleteTarget}
          title="Delete project"
          message={
            deleteTarget
              ? `Are you sure you want to delete "${deleteTarget.name}"?`
              : ""
          }
          confirmLabel="Delete"
          onCancel={closeDeleteConfirm}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      </>
    );
  }

  return (
    <>
      <FlatList
        className="flex-1 bg-canvas"
        data={Project}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardProject
            project={item}
            onPress={() => router.push(`/projects/${item.id}` as Href)}
            onDelete={
              isDeleting
                ? undefined
                : () => openDeleteConfirm(item.id, item.name)
            }
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      <FormModal
        visible={isCreateVisible}
        title="New project"
        fields={PROJECT_FORM_FIELDS}
        submitLabel="Create"
        isSubmitting={isSubmitting}
        error={submitError}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Delete project"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"?`
            : ""
        }
        confirmLabel="Delete"
        onCancel={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
