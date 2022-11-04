import './index.css';
import { Toast, ToastOptions } from './toast/index';
import { Modal, ModalOptions } from './modal/index';

let toastInstance: null | Toast = null;
let modalInstance: null | Modal = null;

export const showToast = (options: ToastOptions) => {
  if (!toastInstance) {
    toastInstance = new Toast();
  }

  toastInstance.show(options);
};

export const hideToast = () => {
  console.log(toastInstance, 'toastInstance');
  toastInstance?.hide();
};

export type LoadingOptions = Partial<Omit<ToastOptions, 'duration' | 'icon'>>;

export const showLoading = (options?: LoadingOptions) => {
  const newOptions: ToastOptions = Object.assign(
    {
      iconUrl: 'https://guild-1251316161.file.myqcloud.com/common/icon-loading-white.png',
      title: '加载中...',
    },
    { ...options },
    {
      duration: 0,
    },
  );

  showToast(newOptions);
};

export const hideLoading = () => {
  hideToast();
};

export const showModal = (options: ModalOptions) => {
  if (!modalInstance) {
    modalInstance = new Modal();
  }

  modalInstance.show(options);
};

export const hideModal = () => {
  modalInstance?.hide();
};
