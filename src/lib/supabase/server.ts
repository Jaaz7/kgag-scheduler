import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Portal",
  description: "Private portal for employees.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const createSupabaseServerClient = (
  context: GetServerSidePropsContext
) => {
  return createPagesServerClient(context);
};
