import type { FormField } from "@/components/ui/FormModal";

export const SYSTEM_FORM_FIELDS: FormField[] = [
  {
    key: "name",
    label: "Name",
    placeholder: "System name",
  },
  {
    key: "target_url",
    label: "Target URL *",
    placeholder: "https://example.com",
  },
  {
    key: "repository_url",
    label: "Repository URL *",
    placeholder: "https://github.com/org/repo",
  },
];

export function systemToFormValues(system: {
  name: string;
  target_url?: string | null;
  repository_url?: string | null;
}): Record<string, string> {
  return {
    name: system.name,
    target_url: system.target_url ?? "",
    repository_url: system.repository_url ?? "",
  };
}
