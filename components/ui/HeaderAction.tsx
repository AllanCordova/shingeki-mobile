import { RN_THEME } from "@/lib/rnThemeColors";
import { MaterialIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

type HeaderActionProps = {
  href: Href;
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  variant?: "primary" | "ghost";
};

export function HeaderAction({
  href,
  label,
  icon,
  variant = "ghost",
}: HeaderActionProps) {
  const isPrimary = variant === "primary";

  return (
    <Link href={href} asChild>
      <Pressable
        className={`flex-row items-center gap-1 rounded-full px-3 py-2 active:opacity-80 ${
          isPrimary
            ? "bg-primary-500"
            : "border border-border-subtle bg-muted"
        }`}
      >
        <MaterialIcons
          name={icon}
          size={16}
          color={isPrimary ? RN_THEME.onAccent : RN_THEME.accent}
        />
        <Text
          className={`text-sm font-bold ${
            isPrimary ? "text-gray-950" : "text-primary-200"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}
