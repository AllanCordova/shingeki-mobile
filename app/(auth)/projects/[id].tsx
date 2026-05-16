import { ProjectDetail } from "@/components/projects";
import { HeaderRight } from "@/components/ui";
import { PROJECT_FORM_FIELDS } from "@/components/projects/projectFormFields";
import {
  SYSTEM_FORM_FIELDS,
  systemToFormValues,
} from "@/components/systems/systemFormFields";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { ErrorMessages } from "@/components/ui/ErrorMessages";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { FormModal } from "@/components/ui/FormModal";
import { Loading } from "@/components/ui/Loading";
import { useProject } from "@/hooks/useProject";
import { useSystem } from "@/hooks/useSystem";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [createSystemVisible, setCreateSystemVisible] = useState(false);
  const [editSystemId, setEditSystemId] = useState<string | null>(null);

  const {
    selectedProject,
    isDetailLoading,
    detailError,
    submitError,
    isSubmitting,
    getProjectById,
    updateProject,
    deleteProject,
    isDeleting,
    clearSelectedProject,
    clearSubmitError,
  } = useProject();

  const {
    systems,
    isLoading: isSystemsLoading,
    error: systemsError,
    submitError: systemSubmitError,
    isSubmitting: isSystemSubmitting,
    getSystemsByProjectId,
    createSystem,
    updateSystem,
    clearSystems,
    clearSubmitError: clearSystemSubmitError,
  } = useSystem();

  const editingSystem = systems.find((s) => s.id === editSystemId);

  useFocusEffect(
    useCallback(() => {
      if (typeof id === "string" && id.length > 0) {
        getProjectById(id);
        getSystemsByProjectId(id);
      }

      return () => {
        clearSelectedProject();
        clearSystems();
      };
    }, [
      id,
      getProjectById,
      getSystemsByProjectId,
      clearSelectedProject,
      clearSystems,
    ]),
  );

  const handleUpdateSubmit = async (values: Record<string, string>) => {
    if (typeof id !== "string") return;

    const ok = await updateProject(id, {
      name: values.name ?? "",
      description: values.description ?? "",
    });
    if (ok) {
      setEditModalVisible(false);
    }
  };

  const openEditModal = () => {
    clearSubmitError();
    setEditModalVisible(true);
  };

  const openDeleteConfirm = () => {
    setDeleteConfirmVisible(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (typeof id !== "string") return;

    const ok = await deleteProject(id);
    if (ok) {
      closeDeleteConfirm();
      router.back();
    }
  };

  const openCreateSystemModal = () => {
    clearSystemSubmitError();
    setCreateSystemVisible(true);
  };

  const openEditSystemModal = (systemId: string) => {
    clearSystemSubmitError();
    setEditSystemId(systemId);
  };

  const handleCreateSystemSubmit = async (values: Record<string, string>) => {
    if (typeof id !== "string") return;

    const ok = await createSystem({
      project_id: id,
      name: values.name ?? "",
      target_url: values.target_url,
      repository_url: values.repository_url,
    });
    if (ok) {
      setCreateSystemVisible(false);
    }
  };

  const handleUpdateSystemSubmit = async (values: Record<string, string>) => {
    if (!editSystemId) return;

    const ok = await updateSystem(editSystemId, {
      name: values.name ?? "",
      target_url: values.target_url,
      repository_url: values.repository_url,
    });
    if (ok) {
      setEditSystemId(null);
    }
  };

  if (!id || typeof id !== "string") {
    return (
      <View className="flex-1 bg-canvas">
        <ComingSoon
          title="Projeto não encontrado"
          description="Identificador inválido"
          icon="folder-off"
        />
      </View>
    );
  }

  if (isDetailLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <Loading />
      </View>
    );
  }

  if (detailError) {
    return (
      <View className="flex-1 bg-canvas px-5 py-6">
        <ErrorMessages message={detailError} type="alert" />
      </View>
    );
  }

  if (!selectedProject) {
    return (
      <View className="flex-1 bg-canvas">
        <ComingSoon
          title="Projeto não encontrado"
          description="Não foi possível carregar os detalhes"
          icon="folder-off"
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: selectedProject.name,
          headerRight: () => (
            <HeaderRight>
              <Pressable
                onPress={openEditModal}
                hitSlop={12}
                className="active:opacity-70"
              >
                <Text className="text-sm font-semibold text-primary-400">Edit</Text>
              </Pressable>
            </HeaderRight>
          ),
        }}
      />
      <ProjectDetail
        project={selectedProject}
        systems={systems}
        systemsLoading={isSystemsLoading}
        systemsError={systemsError}
        onSystemPress={(systemId) =>
          router.push(`/systems/${systemId}` as Href)
        }
        onEditSystem={openEditSystemModal}
        onAddSystem={openCreateSystemModal}
        onDelete={openDeleteConfirm}
        isDeleting={isDeleting}
      />

      <FormModal
        visible={editModalVisible}
        title="Edit project"
        fields={PROJECT_FORM_FIELDS}
        initialValues={{
          name: selectedProject.name,
          description: selectedProject.description,
        }}
        submitLabel="Save"
        isSubmitting={isSubmitting}
        error={submitError}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateSubmit}
      />

      <ConfirmModal
        visible={deleteConfirmVisible}
        title="Delete project"
        message={`Are you sure you want to delete "${selectedProject.name}"?`}
        confirmLabel="Delete"
        onCancel={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <FormModal
        visible={createSystemVisible}
        title="New system"
        fields={SYSTEM_FORM_FIELDS}
        submitLabel="Create"
        isSubmitting={isSystemSubmitting}
        error={systemSubmitError}
        onClose={() => setCreateSystemVisible(false)}
        onSubmit={handleCreateSystemSubmit}
      />

      <FormModal
        visible={!!editSystemId && !!editingSystem}
        title="Edit system"
        fields={SYSTEM_FORM_FIELDS}
        initialValues={
          editingSystem ? systemToFormValues(editingSystem) : undefined
        }
        submitLabel="Save"
        isSubmitting={isSystemSubmitting}
        error={systemSubmitError}
        onClose={() => setEditSystemId(null)}
        onSubmit={handleUpdateSystemSubmit}
      />
    </>
  );
}
