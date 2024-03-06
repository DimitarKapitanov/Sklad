export interface OrderProduct  {
    id: string;
    orderId: string;
    productId: string;
    name: string;
    category: string;
    quantity: number;
    unitId: string;
    unitAcronym: string;
    description: string;
    price: number;
    totalPrice: number;
    modifiedOn?: Date;
    isDeleted?: boolean;
    deletedOn?: Date | null;
}

export interface OrderProductEdit {
    id: string; // Guid in backend
    orderId: string; // Guid in backend
    productId: string; // Guid in backend
    quantity: number; // int in backend
    price: number; // double in backend
    totalPrice: number; // double in backend
    modifiedOn: Date;
}