// src/lib/auth-provider/auth-provider.server.ts

import type { AuthProvider, AuthActionResponse } from "@refinedev/core";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GetServerSidePropsContext } from "next";

interface AuthParams {
  email: string;
  password: string;
}
interface LoginParams extends AuthParams {
  context: GetServerSidePropsContext;
}

export const authProviderServer: AuthProvider = {
  check: async (context: GetServerSidePropsContext) => {
    const supabase = createSupabaseServerClient(context);
    const { data, error } = await supabase.auth.getUser();
    const { user } = data;

    if (error || !user) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/",
      };
    }

    return { authenticated: true };
  },

  login: async ({
    email,
    password,
    context,
  }: LoginParams): Promise<AuthActionResponse> => {
    const supabase = createSupabaseServerClient(context);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: new Error("Login failed. Please check your credentials."),
      };
    }

    return {
      success: true,
      user: data.user,
    };
  },

  logout: async (context: GetServerSidePropsContext) => {
    const supabase = createSupabaseServerClient(context);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: new Error("Logout failed."),
      };
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },

  register: async ({
    email,
    password,
    context,
  }: LoginParams): Promise<AuthActionResponse> => {
    const supabase = createSupabaseServerClient(context);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: new Error("Registration failed. Please try again."),
      };
    }

    return {
      success: true,
      user: data.user,
      redirectTo: "/schedule-hb",
    };
  },

  getPermissions: async (params?: Record<string, any>) => {
    const context = params?.context as GetServerSidePropsContext;
    const supabase = createSupabaseServerClient(context);
    const { data } = await supabase.auth.getUser();

    return data?.user?.role ?? null;
  },

  getIdentity: async (context: GetServerSidePropsContext) => {
    const supabase = createSupabaseServerClient(context);
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },

  onError: async (error) => {
    if (error?.code === "PGRST301" || error?.code === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
