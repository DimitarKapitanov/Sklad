import { createContext, useContext } from "react";
import ProductStore from "./productStore";
import UnitStore from "./unitStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";

interface Store {
    productStore: ProductStore
    unitStore: UnitStore
    commonStore: CommonStore
    userStore: UserStore
}

export const store: Store = {
    productStore: new ProductStore(),
    unitStore: new UnitStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}