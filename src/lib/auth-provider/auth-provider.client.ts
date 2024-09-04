"use client";

import type {
  AuthProvider,
  AuthActionResponse,
  CheckResponse,
} from "@refinedev/core";
import { supabaseBrowserClient } from "@/lib/supabase/client";
import { getDefaultRedirect } from "@components/common/redirect";

export interface CustomCheckResponse extends CheckResponse {
  user_type?: string;
  schedule_id?: string;
}
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
        const { data: profileData, error: profileError } =
          await supabaseBrowserClient
            .from("profiles")
            .select("user_type, schedule_id")
            .eq("user_id", data.session.user.id)
            .single();

        if (profileError || !profileData) {
          console.error("Error fetching profile:", profileError?.message);
          return {
            success: false,
            error: new Error("Failed to fetch user profile."),
          };
        }

        const redirectTo = getDefaultRedirect(
          profileData.user_type,
          profileData.schedule_id
        );
        return {
          success: true,
          redirectTo,
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

  check: async (): Promise<CustomCheckResponse> => {
    try {
      const { data, error } = await supabaseBrowserClient.auth.getUser();

      if (error || !data?.user) {
        console.log("Auth check failed: No user found");
        return {
          authenticated: false,
          redirectTo: "/",
          logout: true,
        };
      }

      const { data: profileData, error: profileError } =
        await supabaseBrowserClient
          .from("profiles")
          .select("user_type, schedule_id")
          .eq("user_id", data.user.id)
          .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError.message);
        return {
          authenticated: false,
          redirectTo: "/",
          logout: true,
        };
      }

      const { user_type, schedule_id } = profileData;

      const redirectTo = getDefaultRedirect(user_type, schedule_id);

      return {
        authenticated: true,
        user_type,
        schedule_id,
        redirectTo,
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
