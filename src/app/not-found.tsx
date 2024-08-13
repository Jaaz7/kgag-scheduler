"use client";

import React, { Suspense } from "react";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { Spin } from "antd";

export default function NotFound() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <ErrorComponent />
    </Suspense>
  );
}
