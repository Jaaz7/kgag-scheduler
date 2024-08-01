import {
  DataProvider,
  LiveProvider,
  BaseKey,
  GetListResponse,
  GetOneResponse,
  CreateResponse,
  UpdateResponse,
  DeleteOneResponse,
} from "@refinedev/core";
import { supabase } from "../../supabaseClient";

type ResourceProps = {
  resource: string;
  id?: BaseKey;
  variables?: any;
};

export const dataProvider: DataProvider = {
  getList: async ({ resource }) => {
    const { data, error } = await supabase.from(resource).select("*");
    if (error) {
      throw new Error(error.message);
    }
    return { data, total: data.length } as GetListResponse<any>;
  },
  getOne: async ({ resource, id }) => {
    const { data, error } = await supabase
      .from(resource)
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return { data } as GetOneResponse<any>;
  },
  create: async ({ resource, variables }) => {
    const { data, error } = await supabase
      .from(resource)
      .insert(variables)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return { data } as CreateResponse<any>;
  },
  update: async ({ resource, id, variables }) => {
    const { data, error } = await supabase
      .from(resource)
      .update(variables)
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return { data } as UpdateResponse<any>;
  },
  deleteOne: async ({ resource, id }) => {
    const { data, error } = await supabase
      .from(resource)
      .delete()
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return { data } as DeleteOneResponse<any>;
  },
  getApiUrl: () => {
    return import.meta.env.VITE_SUPABASE_URL || "";
  },
};

type LiveSubscribeOptions = {
  channel: string;
  types: string[];
  params?: any;
  callback: (payload: any) => void;
  resource?: string;
};

const activeSubscriptions = new Map<string, any>();

export const liveProvider: LiveProvider = {
  subscribe: ({
    channel,
    resource,
    types,
    params,
    callback,
  }: LiveSubscribeOptions) => {
    const supabaseChannel = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: resource },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    activeSubscriptions.set(channel, supabaseChannel);

    return {
      unsubscribe: () => {
        supabaseChannel.unsubscribe();
        activeSubscriptions.delete(channel);
      },
    };
  },
  unsubscribe: (channel: string) => {
    const subscription = activeSubscriptions.get(channel);
    if (subscription) {
      subscription.unsubscribe();
      activeSubscriptions.delete(channel);
    }
  },
};
