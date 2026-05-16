import { ProjectsList } from "@/components/projects";
import { useProject } from "@/hooks/useProject";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function ProjectsTab() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { clearSubmitError } = useProject();

  const openCreateModal = () => {
    clearSubmitError();
    setCreateModalVisible(true);
  };

  return (
    <View className="flex-1 bg-canvas">
      <View className="flex-row items-center justify-between border-b border-border-subtle bg-elevated px-5 pb-4 pt-1">
        <Text className="flex-1 text-sm leading-relaxed text-fg-muted">
          Manage your projects and analyses
        </Text>
        <Pressable
          onPress={openCreateModal}
          className="ml-3 rounded-lg bg-primary-500 px-3 py-2 active:bg-primary-600"
        >
          <Text className="text-xs font-bold text-gray-950">New project</Text>
        </Pressable>
      </View>
      <ProjectsList
        createModalVisible={createModalVisible}
        onCreateModalClose={() => setCreateModalVisible(false)}
      />
    </View>
  );
}
