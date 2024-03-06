import { makeAutoObservable } from "mobx";

export default class NavbarStore {
  isActive = true;

  constructor() {
    makeAutoObservable(this);
  }

  toggleMenu = (boolean: boolean) => {
    this.isActive = boolean;
  };
}
