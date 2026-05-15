import { Error } from "@/components/ui/Error";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setSubmitError(null);
      await login(data);
      router.replace("/");
    } catch (err) {
      const errorMessage =
        err instanceof globalThis.Error ? err.message : "Login failed";
      setSubmitError(errorMessage);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <ScrollView
      className="flex-1 bg-transparent"
      keyboardShouldPersistTaps="handled"
    >
      <View className="min-h-full grow px-6 pb-10 pt-6">
        <View className="mb-8">
        <Text className="text-xs font-semibold uppercase tracking-widest text-primary-400 mb-2">
          Shingeki
        </Text>
        <Text className="text-3xl font-black text-fg leading-tight mb-2">
          Welcome back
        </Text>
        <Text className="text-base text-fg-muted leading-relaxed">
          Security testing, scans, and reports — sign in to continue.
        </Text>
        </View>

        {(error || submitError) && (
          <Error message={error || submitError} type="alert" />
        )}

        <View className="card mt-2 border-border shadow-lg">
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Email"
              placeholder="you@company.com"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              type="email"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              type="password"
            />
          )}
        />

        <TouchableOpacity
          className="mt-2 rounded-xl bg-primary-500 px-6 py-3.5 active:bg-primary-600"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text className="text-center text-base font-bold text-gray-950">
            {isLoading ? "Signing in…" : "Sign in"}
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row flex-wrap items-center justify-center gap-1">
          <Text className="text-center text-sm text-fg-muted">
            No account yet?
          </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary-300">
                Create one
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      </View>
    </ScrollView>
  );
}
