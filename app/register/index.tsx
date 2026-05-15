import { Error } from "@/components/ui/Error";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      icon_path: null,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setSubmitError(null);
      const ok = await register(data);
      if (ok) router.replace("/");
    } catch (err) {
      const errorMessage =
        err instanceof globalThis.Error ? err.message : "Registration failed";
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
        <View className="mb-6">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary-400">
            Shingeki
          </Text>
          <Text className="mb-2 text-3xl font-black leading-tight text-fg">
            Create account
          </Text>
          <Text className="text-base leading-relaxed text-fg-muted">
            Register to run DAST/SAST scans, track findings, and export reports.
          </Text>
        </View>

        {(error || submitError) && (
          <Error message={error || submitError} type="alert" />
        )}

        <View className="card mt-2 border-border shadow-lg">
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Full name"
                placeholder="Alex Morgan"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                type="text"
              />
            )}
          />

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

          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { value, onChange } }) => (
              <Input
                label="Confirm password"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                error={errors.password_confirmation?.message}
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
              {isLoading ? "Creating account…" : "Create account"}
            </Text>
          </TouchableOpacity>

          <View className="mt-6 flex-row flex-wrap items-center justify-center gap-1">
            <Text className="text-center text-sm text-fg-muted">
              Already registered?
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-sm font-semibold text-primary-300">
                  Sign in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
