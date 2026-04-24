import { useCallback, useState } from "react";

const DEFAULT_PARAMS = {
  IsCanceled: false,
  Status: "",
  TimePeriod: "",
};

export function usePmsReminderParams() {
  const [params, setParams] = useState(DEFAULT_PARAMS);

  const setStatus = useCallback((status) => setParams((prev) => ({ ...prev, Status: status })), []);
  const setTimePeriod = useCallback((timePeriod) => setParams((prev) => ({ ...prev, TimePeriod: timePeriod })), []);

  const resetParams = useCallback(() => setParams(DEFAULT_PARAMS), []);

  return { params, setStatus, setTimePeriod };
}
