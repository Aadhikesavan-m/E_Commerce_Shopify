import { useState, useCallback } from 'react';

const useAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: 'Alert',
    message: '',
    type: 'info',
    onConfirm: null,
    onCancel: null,
    showCancel: false,
    autoClose: false,
    autoCloseTime: 3000
  });

  const showAlert = useCallback(({
    title = 'Alert',
    message,
    type = 'info',
    onConfirm,
    onCancel,
    showCancel = false,
    autoClose = false,
    autoCloseTime = 3000
  }) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      onCancel,
      showCancel,
      autoClose,
      autoCloseTime
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback(() => {
    if (alertState.onConfirm) {
      alertState.onConfirm();
    }
    hideAlert();
  }, [alertState, hideAlert]);

  const cancel = useCallback(() => {
    if (alertState.onCancel) {
      alertState.onCancel();
    }
    hideAlert();
  }, [alertState, hideAlert]);

  return {
    alertState,
    showAlert,
    hideAlert,
    confirm,
    cancel
  };
};

export default useAlert;