import { createContext, useContext } from "react";
import ProductStore from "./productStore";
import UnitStore from "./unitStore";
import CommonStore from "./commonStore";

interface Store {
    productStore: ProductStore
    unitStore: UnitStore
    commonStore: CommonStore
}

export const store: Store = {
    productStore: new ProductStore(),
    unitStore: new UnitStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}