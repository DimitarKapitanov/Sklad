
export interface NewOrder {
    id: string;
    isCompleted: boolean;
    completedDate: Date | null;
    orderCreated: Date;
    partnerId: string;
    partnerName: string;
    city: string;
    companyOwnerName: string;
    email: string;
    phone: string;
    address: string;
    vat: string;
    deliveryAddressId: string;
    warehouseId: string;
    warehouseName: string;
    contactPersonId: string;
    orderProductDto: NewOrderProduct[];
}

interface NewOrderProduct {
    id: string
    orderId: string
    productId: string
    name: string
    category: string
    quantity: number
    unitId: string
    unitAcronym: string
    description: string
    price: string
    totalPrice: string
}