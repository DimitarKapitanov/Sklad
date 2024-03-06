import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import NavbarStore from "./navbarStore";
import OrderStore from "./orderStore";
import PartnerStore from "./partnerStore";
import ProductStore from "./productStore";
import ProfileStore from "./profileStore";
import RoleStore from "./roleStore";
import StatisticsStore from "./statisticsStore";
import SupplierStore from "./supplierStore";
import UnitStore from "./unitStore";
import UserStore from "./userStore";
import WarehouseStore from "./wareHousesStore";

interface Store {
    productStore: ProductStore
    unitStore: UnitStore
    commonStore: CommonStore
    userStore: UserStore
    modalStore: ModalStore
    orderStore: OrderStore
    statisticsStore: StatisticsStore
    warehouseStore: WarehouseStore
    partnerStore: PartnerStore
    supplierStore: SupplierStore
    navbarStore: NavbarStore
    profileStore: ProfileStore
    roleStore: RoleStore
}

export const store: Store = {
    productStore: new ProductStore(),
    unitStore: new UnitStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    orderStore: new OrderStore(),
    statisticsStore: new StatisticsStore(),
    warehouseStore: new WarehouseStore(),
    partnerStore: new PartnerStore(),
    supplierStore: new SupplierStore(),
    navbarStore: new NavbarStore(),
    profileStore: new ProfileStore(),
    roleStore: new RoleStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}