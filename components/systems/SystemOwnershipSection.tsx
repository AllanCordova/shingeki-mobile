import { RN_THEME } from "@/lib/rnThemeColors";
import { isSignatureValid } from "@/lib/signature";
import type { SignatureMeta } from "@/schemas/signature";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Pressable, Text, View } from "react-native";
import { Loading } from "../ui/Loading";
import { toast } from "@/hooks/useToast";

type SystemOwnershipSectionProps = {
  targetUrl: string | null;
  signatureToken: string | null;
  embedHint: string | null;
  signatureMeta: SignatureMeta | null;
  isSignatureLoading: boolean;
  isValidating: boolean;
  onIssueToken: () => void;
  onValidate: () => void;
};

async function copyToClipboard(label: string, value: string) {
  await Clipboard.setStringAsync(value);
  toast.success(`${label} copiado`);
}

function CopyableField({
  label,
  value,
  accessibilityLabel,
}: {
  label: string;
  value: string;
  accessibilityLabel: string;
}) {
  return (
    <View className="mt-3 rounded-xl border border-border bg-muted p-3">
      <Text className="text-xs font-semibold uppercase text-fg-subtle">
        {label}
      </Text>
      <Text
        className="mt-1 font-mono text-xs leading-relaxed text-fg"
        selectable
      >
        {value}
      </Text>
      <Pressable
        onPress={() => void copyToClipboard(label, value)}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        className="mt-2 flex-row items-center justify-center gap-2 rounded-lg border border-primary-700 bg-primary-950 px-3 py-2 active:opacity-70"
      >
        <MaterialIcons name="content-copy" size={16} color={RN_THEME.accent} />
        <Text className="text-xs font-semibold text-primary-300">Copiar</Text>
      </Pressable>
    </View>
  );
}

function SignatureBadge({ meta }: { meta: SignatureMeta }) {
  const allowed = isSignatureValid(meta);
  return (
    <View
      className={`mt-4 flex-row items-center gap-2 rounded-xl border px-3 py-2 ${
        allowed
          ? "border-success-700 bg-success-50"
          : "border-error-200 bg-error-50"
      }`}
    >
      <MaterialIcons
        name={allowed ? "verified" : "gpp-bad"}
        size={20}
        color={allowed ? "#4ade80" : RN_THEME.error}
      />
      <View className="flex-1">
        <Text
          className={`text-sm font-bold ${
            allowed ? "text-success-600" : "text-error-300"
          }`}
        >
          {meta.status === "ALLOWED" ? "Posse validada" : "Posse negada"}
        </Text>
        <Text className="text-xs text-fg-muted">
          Expira em{" "}
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
            new Date(meta.expiration),
          )}
        </Text>
      </View>
    </View>
  );
}

export function SystemOwnershipSection({
  targetUrl,
  signatureToken,
  embedHint,
  signatureMeta,
  isSignatureLoading,
  isValidating,
  onIssueToken,
  onValidate,
}: SystemOwnershipSectionProps) {
  const targetDisplay = targetUrl?.trim() || "URL alvo não configurada";

  return (
    <View className="mt-6 rounded-2xl border border-border bg-elevated p-4">
      <View className="flex-row items-center gap-2">
        <MaterialIcons name="verified-user" size={20} color={RN_THEME.accent} />
        <Text className="text-base font-bold text-fg">Validação de posse</Text>
      </View>

      <Text className="mt-3 text-sm leading-relaxed text-fg-muted">
        Prove que você controla o site antes de executar scans DAST. Cole a meta
        tag abaixo na{" "}
        <Text className="font-semibold text-fg">página inicial</Text> de{" "}
        <Text className="font-semibold text-primary-300">{targetDisplay}</Text>,
        publique e clique em validar.
      </Text>

      <Pressable
        onPress={onIssueToken}
        disabled={isSignatureLoading}
        accessibilityLabel="Gerar token de verificação"
        accessibilityRole="button"
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 active:bg-primary-600 disabled:opacity-50"
      >
        {isSignatureLoading ? (
          <Loading size="small" color={RN_THEME.onAccent} />
        ) : (
          <>
            <MaterialIcons
              name="vpn-key"
              size={18}
              color={RN_THEME.onAccent}
            />
            <Text className="text-sm font-bold text-gray-950">
              Gerar token de verificação
            </Text>
          </>
        )}
      </Pressable>

      {signatureToken && embedHint ? (
        <>
          <CopyableField
            label="Token"
            value={signatureToken}
            accessibilityLabel="Copiar token de verificação"
          />
          <CopyableField
            label="Meta tag (cole no HTML)"
            value={embedHint}
            accessibilityLabel="Copiar meta tag de verificação"
          />
        </>
      ) : null}

      <Pressable
        onPress={onValidate}
        disabled={isValidating || !signatureToken}
        accessibilityLabel="Validar posse do sistema"
        accessibilityRole="button"
        className="mt-4 flex-row items-center justify-center gap-2 rounded-xl border border-secondary-600 bg-secondary-950 px-4 py-3 active:opacity-70 disabled:opacity-50"
      >
        {isValidating ? (
          <Loading size="small" />
        ) : (
          <>
            <MaterialIcons name="fact-check" size={18} color={RN_THEME.accent} />
            <Text className="text-sm font-bold text-secondary-200">
              Validar posse
            </Text>
          </>
        )}
      </Pressable>

      {signatureMeta ? <SignatureBadge meta={signatureMeta} /> : null}
    </View>
  );
}
