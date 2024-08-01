import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { dataProvider, liveProvider } from "./providers/data";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { myAuthProvider } from "./providers/auth";
import { Home, ForgotPassword, Login, Register } from "./pages";

function App() {
  const isDevelopment = import.meta.env.MODE === "development";

  if (isDevelopment) {
    console.log("You are in development mode");
  } else {
    console.log("You are in production mode");
  }

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <AntdApp>
          {isDevelopment ? (
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={myAuthProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "0PUiNW-Kk5der-rn5HKm",
                  liveMode: "auto",
                }}
              >
                <Routes>
                  <Route index element={<WelcomePage />} />
                  <Route path="home" element={<Home />} />
                  <Route path="register" element={<Register />} />
                  <Route path="login" element={<Login />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
                <DevtoolsPanel />
              </Refine>
            </DevtoolsProvider>
          ) : (
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={myAuthProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "0PUiNW-Kk5der-rn5HKm",
                liveMode: "auto",
              }}
            >
              <Routes>
                <Route index element={<WelcomePage />} />
                <Route path="home" element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          )}
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
