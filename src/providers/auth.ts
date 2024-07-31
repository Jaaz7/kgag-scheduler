import {
    AuthProvider,
    OnErrorResponse as RefineOnErrorResponse,
  } from "@refinedev/core";
  import { supabase } from "../supabaseClient";
  
  interface OnErrorResponse {
    statusCode: string | number;
    error: Error;
  }
  
  export const myAuthProvider: AuthProvider = {
    login: async ({ email, password }) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (error) {
          throw error;
        }
  
        localStorage.setItem("access_token", data.session?.access_token || "");
  
        return {
          success: true,
          redirectTo: "/",
        };
      } catch (e) {
        const error = e as Error;
  
        return {
          success: false,
          error: {
            message: "message" in error ? error.message : "Login failed",
            name: "name" in error ? error.name : "Invalid email or password",
          },
        };
      }
    },
  
    logout: async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("access_token");
  
      return {
        success: true,
        redirectTo: "/login",
      };
    },
  
    check: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
  
      if (data.session) {
        return {
          authenticated: true,
        };
      } else {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }
    },
  
    onError: async (error): Promise<OnErrorResponse> => {
      if (error.statusCode === "UNAUTHENTICATED") {
        return {
          statusCode: error.statusCode,
          error: new Error("User is unauthenticated"),
        };
      }
  
      return {
        statusCode: error.statusCode || 500,
        error: new Error("An unknown error occurred"),
      };
    },
  };
  