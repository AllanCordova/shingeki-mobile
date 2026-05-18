import { RN_THEME } from "@/lib/rnThemeColors";
import { isSignatureValid } from "@/lib/signature";
import type { SignatureMeta } from "@/schemas/signature";
import type { SystemResult } from "@/schemas/systemResult";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Loading } from "../ui/Loading";
import { SystemResultsList } from "./SystemResultsList";

type SystemScanSectionProps = {
  signatureMeta: SignatureMeta | null;
  lastScanInfo: { attacks_count: number; target_url: string } | null;
  scanResults: SystemResult[];
  isScanning: boolean;
  isResultsLoading: boolean;
  onStartScan: () => void;
  onRefreshResults: () => void;
};

export function SystemScanSection({
  signatureMeta,
  lastScanInfo,
  scanResults,
  isScanning,
  isResultsLoading,
  onStartScan,
  onRefreshResults,
}: SystemScanSectionProps) {
  const canScan = isSignatureValid(signatureMeta);

  return (
    <View className="mt-6 rounded-2xl border border-border bg-elevated p-4">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="radar" size={20} color={RN_THEME.accent} />
        <Text className="text-base font-bold text-fg">Scan DAST</Text>
      </View>

      <Text className="mt-3 text-sm leading-relaxed text-fg-muted">
        {canScan
          ? "Com a posse validada, você pode enfileirar um scan dinâmico contra o alvo."
          : "Valide a posse do sistema antes de iniciar um scan."}
      </Text>

      <Pressable
        onPress={onStartScan}
        disabled={canScan || isScanning}
        accessibilityLabel="Iniciar scan DAST"
        accessibilityRole="button"
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 active:bg-primary-600 disabled:opacity-40"
      >
        {isScanning ? (
          <Loading size="small" color={RN_THEME.onAccent} />
        ) : (
          <>
            <MaterialIcons
              name="play-arrow"
              size={20}
              color={RN_THEME.onAccent}
            />
            <Text className="text-sm font-bold text-gray-950">
              Iniciar scan DAST
            </Text>
          </>
        )}
      </Pressable>

      {lastScanInfo ? (
        <View className="mt-4 rounded-xl border border-primary-700 bg-primary-950 p-3">
          <Text className="text-xs font-semibold uppercase text-primary-400">
            Scan enfileirado
          </Text>
          <Text className="mt-1 text-sm text-fg">
            {lastScanInfo.attacks_count} ataque(s) contra{" "}
            <Text className="font-medium text-primary-300">
              {lastScanInfo.target_url}
            </Text>
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={onRefreshResults}
        disabled={isResultsLoading}
        accessibilityLabel="Atualizar resultados do scan"
        accessibilityRole="button"
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 active:opacity-70 disabled:opacity-50"
      >
        {isResultsLoading ? (
          <Loading size="small" />
        ) : (
          <>
            <MaterialIcons name="refresh" size={18} color={RN_THEME.accent} />
            <Text className="text-sm font-semibold text-fg">
              Atualizar resultados
            </Text>
          </>
        )}
      </Pressable>

      <SystemResultsList results={scanResults} isLoading={isResultsLoading} />
    </View>
  );
}
