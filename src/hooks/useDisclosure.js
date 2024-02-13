import { useState, useCallback } from "react";

const useDisclosure = (defaultState = false) => {
  const [open, setOpen] = useState(defaultState);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setOpen((state) => !state);
  }, []);

  return { open, onOpen, onClose, onToggle };
};

export default useDisclosure;
