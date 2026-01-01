import React, { useEffect } from 'react';
import './customAlert.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const CustomAlert = ({ 
  isOpen, 
  onClose, 
  title = "Alert", 
  message, 
  type = "info", // "info", "success", "warning", "error"
  showConfirm = true,
  confirmText = "OK",
  onConfirm,
  showCancel = false,
  cancelText = "Cancel",
  onCancel,
  autoClose = false,
  autoCloseTime = 3000
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        if (onConfirm) onConfirm();
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseTime, onConfirm, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const typeConfig = {
    info: {
      icon: <Info size={24} />,
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },
    success: {
      icon: <CheckCircle size={24} />,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    },
    warning: {
      icon: <AlertCircle size={24} />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fde68a'
    },
    error: {
      icon: <AlertCircle size={24} />,
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#fecaca'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="custom-alert-overlay">
      <div 
        className="custom-alert-modal"
        style={{
          borderColor: config.borderColor,
          backgroundColor: config.bgColor
        }}
      >
        <div className="custom-alert-header">
          <div className="custom-alert-title-wrapper">
            <span style={{ color: config.color }} className="custom-alert-icon">
              {config.icon}
            </span>
            <h3 className="custom-alert-title">{title}</h3>
          </div>
          {!autoClose && (
            <button className="custom-alert-close" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className="custom-alert-body">
          <p className="custom-alert-message">{message}</p>
        </div>

        {!autoClose && (
          <div className="custom-alert-footer">
            {showCancel && (
              <button 
                className="custom-alert-btn cancel-btn"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
            )}
            {showConfirm && (
              <button 
                className="custom-alert-btn confirm-btn"
                onClick={handleConfirm}
                style={{ backgroundColor: config.color }}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomAlert;