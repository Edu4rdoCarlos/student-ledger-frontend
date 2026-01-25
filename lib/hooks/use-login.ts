"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth-service";
import { userService } from "@/lib/services/user-service";
import { useAuthStore } from "@/lib/store/auth-store";
import { getHomeRouteForUser } from "@/lib/helpers/navigation-helpers";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const { accessToken } = await authService.login(data);

      setAuth(
        {
          id: "",
          name: "",
          email: "",
          role: "ADMIN",
          isFirstAccess: false,
        },
        accessToken
      );

      const user = await userService.getMe();
      setAuth(user, accessToken);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const homeRoute = getHomeRouteForUser(user);
      router.push(homeRoute);
    } catch (error) {
      form.setError("password", {
        type: "manual",
        message:
          error instanceof Error ? error.message : "Credenciais inválidas",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
