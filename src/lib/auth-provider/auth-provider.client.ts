"use client";

import type { AuthProvider, AuthActionResponse } from "@refinedev/core";
import { supabaseBrowserClient } from "@/lib/supabase/client";

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      const { data, error } =
        await supabaseBrowserClient.auth.signInWithPassword({
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

      if (data?.session) {
        return {
          success: true,
          redirectTo: "/schedule-hb",
        };
      }

      return {
        success: false,
        error: new Error("Invalid username or password"),
      };
    } catch (err) {
      console.error("Unexpected error during login:", err);

      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  },

  logout: async () => {
    const { error } = await supabaseBrowserClient.auth.signOut();

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

  register: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.signUp({
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

      if (data) {
        return {
          success: true,
          redirectTo: "/schedule-hb",
        };
      }

      return {
        success: false,
        error: new Error("Registration failed due to unknown reasons."),
      };
    } catch (err) {
      console.error("Unexpected error during registration:", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  },

  check: async () => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.getUser();

      if (error || !data?.user) {
        return {
          authenticated: false,
          redirectTo: "/",
          logout: true,
        };
      }

      return {
        authenticated: true,
      };
    } catch (err) {
      console.error("Error during authentication check:", err);
      return {
        authenticated: false,
        redirectTo: "/",
        logout: true,
      };
    }
  },

  getPermissions: async () => {
    const { data } = await supabaseBrowserClient.auth.getUser();

    return data?.user?.role ?? null;
  },

  getIdentity: async () => {
    const { data } = await supabaseBrowserClient.auth.getUser();

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
