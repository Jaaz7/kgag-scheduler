"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Calendar } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";

const Schedule: React.FC = () => {
  const onPanelChange = (
    value: Dayjs,
    mode: CalendarProps<Dayjs>["mode"]
  ) => {};

  return <Calendar onPanelChange={onPanelChange} />;
};

export default function ScheduleHBPage() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return shouldRender ? (
    <Suspense fallback={<div />}>
      <Schedule />
    </Suspense>
  ) : null;
}
