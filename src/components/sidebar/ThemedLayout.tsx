import React, { useMemo } from "react";
import { Grid, Layout as AntdLayout } from "antd";

import { ThemedSiderV2 as DefaultSider } from "./Sider";
import type { RefineThemedLayoutV2Props } from "./types";
import { ThemedLayoutContextProvider } from "./ThemedLayoutContext";

export const ThemedLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  siderCollapsed,
  setSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;
  const hasSider = !!SiderToRender({
    Title,
    siderCollapsed,
    setSiderCollapsed,
  });

  return (
    <ThemedLayoutContextProvider>
      <AntdLayout style={{ display: "flex" }} hasSider={hasSider}>
        <SiderToRender
          Title={Title}
          siderCollapsed={siderCollapsed}
          setSiderCollapsed={setSiderCollapsed}
        />
        <AntdLayout
          style={{
            transition: "margin-left 0.2s ease",
          }}
        >
          <AntdLayout.Content>
            {children}
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
