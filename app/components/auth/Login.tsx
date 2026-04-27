import { useAuth } from "@/hooks/useAuth";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { Input } from "../ui/Input";
import Error from "../ui/Error";

export default function Login() {
  const { login, isLoading, error, validationErrors, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login({ email: data.email, password: data.password });
    if (success) {
      Toast.show({ type: "success", text1: "Logged in successfully" });
      // navigate back to home
      router.push("/");
    }
  };

  return (
    <View className="flex-1 bg-background px-6 py-8">
      <View className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-primary-container/20" />
      <View className="absolute -right-20 bottom-28 h-72 w-72 rounded-full bg-secondary-container/30" />

      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-md border border-outline-variant/60 bg-surface-container/95 px-6 py-8">
          <View className="mb-8 items-center">
            <Text className="font-headline text-3xl font-bold tracking-tight text-on-surface">
              'Welcome Back'
            </Text>
            <Text className="mt-2 font-label text-[10px] uppercase tracking-[2.5px] text-outline">
              authorize access
            </Text>
          </View>

          <View className="gap-5">
            <Input
              placeholder="operator@sentinel.sys"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              label="Operator ID"
              error={validationErrors.email}
              containerClassName=""
              inputClassName="pl-2"
              leftElement={
                <MaterialIcons
                  name="alternate-email"
                  size={18}
                  color="#958ea0"
                />
              }
              value={data.email}
              onChangeText={(email) => {
                clearError();
                setData({ ...data, email });
              }}
            />

            <Input
              placeholder="........"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              label="Access Key"
              error={validationErrors.password}
              containerClassName=""
              inputClassName="pl-2"
              leftElement={
                <MaterialIcons name="lock-outline" size={18} color="#958ea0" />
              }
              rightElement={
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={18}
                    color="#958ea0"
                  />
                </TouchableOpacity>
              }
              value={data.password}
              onChangeText={(password) => {
                clearError();
                setData({ ...data, password });
              }}
            />

            <Pressable
              className="h-12 items-center justify-center bg-primary-container disabled:opacity-60"
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#131313" size="small" />
              ) : (
                <Text className="font-headline text-sm font-bold uppercase tracking-[2px] text-surface">
                  Authorize Access
                </Text>
              )}
            </Pressable>

            <Error error={error} />
          </View>
        </View>
      </View>
    </View>
  );
}
