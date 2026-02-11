import { useState, useCallback } from 'react';
import type { ModalVariant } from '@/components/ui/Modal';

interface ModalState {
  isOpen: boolean;
  message: string;
  title?: string;
  variant: ModalVariant;
}

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    message: '',
    variant: 'info',
  });

  const showModal = useCallback(
    (message: string, variant: ModalVariant = 'info', title?: string) => {
      setModalState({
        isOpen: true,
        message,
        variant,
        title,
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...modalState,
    showModal,
    closeModal,
  };
}
