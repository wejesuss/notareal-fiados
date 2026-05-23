export interface DialogConfig {
  title: string;
  message: string;
  checkboxLabel: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

export interface NotifyConfig {
  disabledMessage: string;
  enabledMessage: string;
  errorMessage: string;
}
