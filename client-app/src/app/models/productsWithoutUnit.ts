
export interface Delivery {
    deliveryCompanyId: string;
    products: ProductWithoutUnit[];
}

export interface ProductWithoutUnit {
    name: string;
    category: string;
    quantity: number;
    unitId: string;
    unitAcronym: string | undefined;
    description: string;
    price: string;
    deliveryPrice: string;
    isDeleted: boolean;
    id: string;
    createdOn: Date | null;
    modifiedOn: Date | null;
    deletedOn: Date | null;
}