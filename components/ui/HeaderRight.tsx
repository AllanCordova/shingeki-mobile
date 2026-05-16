import { UserAvatar } from "@/components/ui/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

type HeaderRightProps = {
  children?: ReactNode;
};

export function HeaderRight({ children }: HeaderRightProps) {
  const user = useAuth((state) => state.user);

  return (
    <View className="flex-row items-center gap-2 pr-1">
      {children}
      <Link href={"/profile" as Href} asChild>
        <Pressable
          hitSlop={8}
          className="rounded-full active:opacity-80"
          accessibilityLabel="Open profile"
        >
          <UserAvatar iconPath={user?.icon_path} size={36} />
        </Pressable>
      </Link>
    </View>
  );
}
