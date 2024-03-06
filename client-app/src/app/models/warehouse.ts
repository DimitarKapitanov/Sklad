export interface Warehouse {
    id: string;
    name: string;
    contactPersonId: string;
    userName: string;
    description: string
}

export interface WarehouseEditValues {
    name: string;
    description: string
    userName: string;
}