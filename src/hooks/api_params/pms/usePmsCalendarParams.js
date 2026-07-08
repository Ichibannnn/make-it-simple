import { useCallback, useState } from "react";

const DEFAULT_PARAMS = {
  IsCanceled: false,
  Search: "",
  Site: null,
  PmsType: null,
};

export function usePmsCalendarParams() {
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const setSearch = useCallback((search) => setParams((prev) => ({ ...prev, Search: search })), []);
  const setSite = useCallback((site) => setParams((prev) => ({ ...prev, Site: site })), []);
  const setPmsType = useCallback((pmsType) => setParams((prev) => ({ ...prev, PmsType: pmsType })), []);

  const resetParams = useCallback(() => setParams(DEFAULT_PARAMS), []);

  return { params, setSearch, setSite, setPmsType };
}
