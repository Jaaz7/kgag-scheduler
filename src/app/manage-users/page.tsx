"use client";

import React, { Suspense } from "react";
import { Spin } from "antd";

export default function ManageUsersPage() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <div>
        <h1>pretend you can manage users here...</h1>
      </div>
    </Suspense>
  );
}
