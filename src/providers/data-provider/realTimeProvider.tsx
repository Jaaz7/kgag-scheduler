"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseBrowserClient } from '../../utils/supabase/client';

interface RealTimeProviderProps {
  children: ReactNode;
}

interface DataItem {
  id: number;
}

interface Payload {
  new: DataItem;
  old?: DataItem;
}

const RealTimeContext = createContext<DataItem[]>([]);

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
    const [data, setData] = useState<DataItem[]>([]);
  
    useEffect(() => {
      const fetchInitialData = async () => {
        const { data: initialData, error } = await supabaseBrowserClient
          .from('TBD')
          .select('*');
  
        if (error) {
          console.error('Error fetching initial data:', error);
        } else {
          setData(initialData as DataItem[]);
        }
      };
  
      fetchInitialData();
  
      const channel = supabaseBrowserClient
        .channel('realtime:TBD')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'TBD' }, (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        })
        .subscribe();
  
      return () => {
        channel.unsubscribe();
      };
    }, []);

  return (
    <RealTimeContext.Provider value={data}>
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => useContext(RealTimeContext);