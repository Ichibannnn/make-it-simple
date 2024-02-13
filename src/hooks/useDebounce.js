import { useEffect, useState } from "react";

const useDebounce = (initialValue, delay) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValue(initialValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [initialValue, delay]);

  return value;
};

export default useDebounce;
