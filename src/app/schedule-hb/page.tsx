"use client";

import React, { Suspense } from 'react';
import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { Spin } from 'antd';

const App: React.FC = () => {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return <Calendar onPanelChange={onPanelChange} />;
};

export default function ScheduleHBPage() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <App />
    </Suspense>
  );
}
