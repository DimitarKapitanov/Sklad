import { createContext, useContext } from "react";
import ProductStore from "./productStore";
import UnitStore from "./unitStore";
interface Store {
    productStore: ProductStore
    unitStore: UnitStore
}

export const store: Store = {
    productStore: new ProductStore(),
    unitStore: new UnitStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}