import { Modal, ModalOptions } from './modal';

export * from './modal';

export const modal = new Modal();

export const showModal = (options: ModalOptions) => {
  modal.show(options);
};

export const hideModal = () => {
  modal.hide();
};
