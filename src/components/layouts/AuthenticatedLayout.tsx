"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemedLayoutV2, ThemedTitleV2 } from "@components/sidebar";
import { Header } from "@components/header/Header";
import { authProviderClient } from "@lib/auth-provider";
import { supabaseBrowserClient } from "@lib/supabase/client";
import { Spin } from "antd";
import "@/styles/globals.css";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabaseBrowserClient.auth.onAuthStateChange(
      (_, session) => {
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/");
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authProviderClient.check();
        if (response.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/");
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        setIsAuthenticated(false);
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => (
        <ThemedTitleV2 {...titleProps} text="HB Shop" link="/schedule-hb" />
      )}
    >
      {children}
    </ThemedLayoutV2>
  );
}
