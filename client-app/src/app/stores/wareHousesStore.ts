import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/Agent";
import { SelectedWarehouse } from "../models/selectedWarehouse";
import { Warehouse } from "../models/warehouse";

export default class WarehouseStore {
  wareHouseRegistry = new Map<string, Warehouse>();
  wareHouseOptions: { key: string, text: string, value: string }[] = [];

  selectedWareHouse: SelectedWarehouse | null = null;
  selectWareHouseForOrder: Warehouse | null = null;
  loadingInitial = false;
  isEditing = false;
  isDeleting = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadWareHouses = async () => {
    this.setLoadingInitial(true);
    try {
      const wareHouses = await agent.Warehouse.list();
      runInAction(() => {
        wareHouses.forEach((wareHouse) => {
          this.setWareHouse(wareHouse);
        });
        this.setLoadingInitial(false);
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.setLoadingInitial(false);
      });
    }
  };

  private setWareHouse = (wareHouse: Warehouse) => {
    this.wareHouseRegistry.set(wareHouse.id, wareHouse);
    if (!this.wareHouseOptions.find(x => x.key === wareHouse.id)) {
      this.wareHouseOptions.push({
        key: wareHouse.id,
        text: wareHouse.name,
        value: wareHouse.id
      });
    }
  };

  get wareHouses() {
    return Array.from(this.wareHouseRegistry.values());
  }

  wareHouseByUserName = (userName: string | undefined) => {
    const wareHouse = Array.from(this.wareHouseRegistry.values()).find(x => x.userName === userName);
    if (wareHouse) {
      return wareHouse;
    }
    return null;
  }

  private setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  getWareHouse = async (id: string) => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Warehouse.details(id);
      runInAction(() => {
        this.selectedWareHouse = result;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  editWarehouse = async (id: string, data: Warehouse) => {
    this.isEditing = true;
    try {
      await agent.Warehouse.edit(id, data);
      runInAction(() => {
        this.wareHouseRegistry.set(id, data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.isEditing = false;
      });
    }
  };

  deleteWarehouse = async (id: string) => {
    this.isDeleting = true;
    try {
      await agent.Warehouse.delete(id);
      runInAction(() => {
        this.wareHouseRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.isDeleting = false;
      });
    }
  }

  createWarehouse = async (warehouse: Warehouse) => {
    this.loading = true;
    try {
      await agent.Warehouse.create(warehouse);
      runInAction(() => {
        this.wareHouseRegistry.set(warehouse.id, warehouse);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // private clearWareHouseOptions = () => {
  //   this.wareHouseOptions = [];
  // };

  selectWareHouse = (id: string) => {
    const warehouse = this.wareHouseRegistry.get(id);
    if (warehouse) {
      this.selectWareHouseForOrder = warehouse;
    } else {
      this.selectWareHouseForOrder = null;
    }
  };

  clearSelectedWareHouse = () => {
    this.selectWareHouseForOrder = null;
  };
}
