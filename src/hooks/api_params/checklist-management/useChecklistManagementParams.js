import { useCallback, useState } from "react";

const DEFAULT_PARAMS = {
  Status: true,
  Search: "",
};

export function useChecklistManagementParams() {
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const setStatus = useCallback((status) => {
    setParams((prev) => ({ ...prev, Status: status }));
  }, []);

  const setSearch = useCallback((search) => {
    setParams((prev) => ({ ...prev, Search: search }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  return {
    params,
    setStatus,
    setSearch,
    resetParams,
  };
}
