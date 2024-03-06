export interface DeliveredProducts {
    id: string;
    createdOn: Date;
    partnerId: string;
    partnerName: string;
    city: string;
    companyOwnerName: string;
    email: string;
    phone: string;
    address: string;
    bulstat: string;
    contactPersonName: string;
    isSupplier: boolean;
    deliveredProducts: OrderProductsDtos[];
}
export interface OrderProductsDtos {
    orderId: string;
    name: string;
    category: string;
    quantity: number;
    unitAcronym: string;
    price: number;
    totalPrice: number;
}

export interface SoldProducts {
    id: string;
    isCompleted: boolean;
    completedDate: string | Date;
    createdOn: string | Date;
    partnerName: string;
    city: string;
    companyOwnerName: string;
    email: string;
    phone: string;
    address: string;
    bulstat: string;
    deliveryCity: string;
    deliveryAddress: string;
    warehouseName: string;
    orderProductDtos: OrderProductsDtos[];
}

export interface Statistics {
    deliveredProducts?: DeliveredProducts[];
    soldProducts?: SoldProducts[];
}

export interface Filters {
    filter: string;
    startDate: string;
    endDate: string;
}