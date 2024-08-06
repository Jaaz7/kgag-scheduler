import { authProviderServer } from "@providers/auth-provider";
import { redirect } from "next/navigation";
import { AuthPage } from "@refinedev/antd";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
    return null;
  }

  return <LoginComponent />;
}

const LoginComponent = () => {
  return (
    <AuthPage
      type="login"
    />
  );
};

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}