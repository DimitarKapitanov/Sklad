import { makeAutoObservable } from "mobx";

interface Modal {
  id?: string;
  open: boolean;
  body: JSX.Element | null;
  size: "small" | "mini" | "tiny" | "large" | "fullscreen" | undefined;
}

export default class ModalStore {
  modal: Modal = {
    open: false,
    body: null,
    size: undefined,
  };

  modals: Modal[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  openModal = (content: JSX.Element, size: "small" | "mini" | "tiny" | "large" | "fullscreen" | undefined) => {
    this.modal.open = true;
    this.modal.body = content;
    this.modal.size = size;
  };

  openModals = (id: string, content: JSX.Element, size: "small" | "mini" | "tiny" | "large" | "fullscreen" | undefined) => {
    this.modals.push({
      id,
      open: true,
      body: content,
      size,
    });
  };

  closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
    this.modal.size = undefined;
  };

  closeModals = (id: string) => {
    this.modals = this.modals.filter(modal => modal.id !== id);
  };
}
