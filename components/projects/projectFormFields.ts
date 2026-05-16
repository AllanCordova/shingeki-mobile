import type { FormField } from "@/components/ui/FormModal";

export const PROJECT_FORM_FIELDS: FormField[] = [
  {
    key: "name",
    label: "Name",
    placeholder: "Project name",
  },
  {
    key: "description",
    label: "Description",
    placeholder: "Project description",
    multiline: true,
  },
];
