import { useCallback, useState } from "react";

const DEFAULT_PARAMS = {
  IsCanceled: false,
  Search: "",
  SiteId: null,
  PmsTypeId: null,
};

export function usePmsCalendarParams() {
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const setSearch = useCallback((search) => setParams((prev) => ({ ...prev, Search: search })), []);
  const setSiteId = useCallback((siteId) => setParams((prev) => ({ ...prev, SiteId: siteId })), []);
  const setPmsTypeId = useCallback((pmsTypeId) => setParams((prev) => ({ ...prev, PmsTypeId: pmsTypeId })), []);

  const resetParams = useCallback(() => setParams(DEFAULT_PARAMS), []);

  return { params, setSearch, setSiteId, setPmsTypeId, resetParams };
}
