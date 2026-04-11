"use client";

import { DependencyList, useEffect, useState } from "react";

interface UseLoadingResult<T> {
  loading: boolean;
  error?: unknown;
  response?: T;
  reload: () => Promise<void>;
}

export default function useLoading<T>(
  loadingFunction: () => Promise<T>,
  deps: DependencyList = [],
): UseLoadingResult<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [response, setResponse] = useState<T>();

  async function load() {
    try {
      setLoading(true);
      setResponse(await loadingFunction());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, deps);

  return { loading, error, response, reload: load };
}
