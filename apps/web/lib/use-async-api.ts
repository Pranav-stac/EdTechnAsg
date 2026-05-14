"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type AsyncApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAsyncApi<T>(path: string) {
  const [state, setState] = useState<AsyncApiState<T>>({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;

    api<T>(path)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Request failed",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [path]);

  return state;
}
