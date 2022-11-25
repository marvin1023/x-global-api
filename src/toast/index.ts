import { Toast, ToastOptions, LoadingOptions } from './toast';
import './index.css';

export * from './toast';

export const toast = new Toast();

export const showToast = (options: ToastOptions) => {
  toast.show(options);
};

export const hideToast = () => {
  toast.hide();
};

export const showLoading = (options?: LoadingOptions) => {
  showToast({ icon: 'loading', title: '加载中...', ...options });
};

export const hideLoading = () => {
  hideToast();
};
