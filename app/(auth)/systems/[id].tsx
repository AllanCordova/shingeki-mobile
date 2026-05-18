import {
  SystemDetail,
  SystemOwnershipSection,
  SystemScanSection,
} from "@/components/systems";
import { HeaderRight } from "@/components/ui";
import {
  SYSTEM_FORM_FIELDS,
  systemToFormValues,
} from "@/components/systems/systemFormFields";
import { ComingSoon } from "@/components/ui/ComingSoon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ErrorMessages } from "@/components/ui/ErrorMessages";
import { FormModal } from "@/components/ui/FormModal";
import { Loading } from "@/components/ui/Loading";
import { useSystem } from "@/hooks/useSystem";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function SystemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const {
    selectedSystem,
    isDetailLoading,
    isDeleting,
    isSubmitting,
    detailError,
    submitError,
    signatureToken,
    embedHint,
    signatureMeta,
    lastScanInfo,
    scanResults,
    isSignatureLoading,
    isValidating,
    isScanning,
    isResultsLoading,
    getSystemById,
    updateSystem,
    deleteSystem,
    issueSignatureToken,
    validateSignature,
    startScan,
    getScanResults,
    clearSelectedSystem,
    clearScanState,
    clearSubmitError,
  } = useSystem();

  useFocusEffect(
    useCallback(() => {
      if (typeof id === "string" && id.length > 0) {
        getSystemById(id);
      }

      return () => {
        clearSelectedSystem();
        clearScanState();
      };
    }, [
      id,
      getSystemById,
      clearSelectedSystem,
      clearScanState,
    ]),
  );

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

    const ok = await deleteSystem(id);
    if (ok) {
      closeDeleteConfirm();
      router.back();
    }
  };

  const handleUpdateSubmit = async (values: Record<string, string>) => {
    if (typeof id !== "string") return;

    const ok = await updateSystem(id, {
      name: values.name ?? "",
      target_url: values.target_url,
      repository_url: values.repository_url,
    });
    if (ok) {
      setEditModalVisible(false);
    }
  };

  if (!id || typeof id !== "string") {
    return (
      <View className="flex-1 bg-canvas">
        <ComingSoon
          title="Sistema não encontrado"
          description="Identificador inválido"
          icon="dns"
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

  if (!selectedSystem) {
    return (
      <View className="flex-1 bg-canvas">
        <ComingSoon
          title="Sistema não encontrado"
          description="Não foi possível carregar os detalhes"
          icon="dns"
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: selectedSystem.name,
          headerRight: () => (
            <HeaderRight>
              <Pressable
                onPress={openEditModal}
                hitSlop={12}
                className="active:opacity-70"
              >
                <Text className="text-sm font-semibold text-primary-400">
                  Editar
                </Text>
              </Pressable>
            </HeaderRight>
          ),
        }}
      />
      <ScrollView
        className="flex-1 bg-canvas"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SystemDetail
          system={selectedSystem}
          onDelete={openDeleteConfirm}
          isDeleting={isDeleting}
        />

        <View className="px-5 pb-8">
          <SystemOwnershipSection
            targetUrl={selectedSystem.target_url}
            signatureToken={signatureToken}
            embedHint={embedHint}
            signatureMeta={signatureMeta}
            isSignatureLoading={isSignatureLoading}
            isValidating={isValidating}
            onIssueToken={() => void issueSignatureToken(id)}
            onValidate={() => void validateSignature(id)}
          />

          <SystemScanSection
            signatureMeta={signatureMeta}
            lastScanInfo={lastScanInfo}
            scanResults={scanResults}
            isScanning={isScanning}
            isResultsLoading={isResultsLoading}
            onStartScan={() => void startScan(id)}
            onRefreshResults={() => void getScanResults(id)}
          />
        </View>
      </ScrollView>

      <FormModal
        visible={editModalVisible}
        title="Editar sistema"
        fields={SYSTEM_FORM_FIELDS}
        initialValues={systemToFormValues(selectedSystem)}
        submitLabel="Salvar"
        isSubmitting={isSubmitting}
        error={submitError}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateSubmit}
      />

      <ConfirmModal
        visible={deleteConfirmVisible}
        title="Excluir sistema"
        message={`Tem certeza que deseja excluir "${selectedSystem.name}"?`}
        confirmLabel="Excluir"
        onCancel={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
