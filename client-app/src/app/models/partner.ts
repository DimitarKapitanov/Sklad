export interface Partner {
    id: string;
    name: string;
    city: string;
    companyOwnerName: string;
    email: string;
    phone: string;
    address: string;
    bulstat: string;
    deliveryAddress: Array<DeliveryAddress>;
    ordersId: string[];
    isClient: boolean;
    isSupplier: boolean;
}

export interface DeliveryAddress {
    id: string
    partnerId: string
    city: string
    address: string
}

export interface PartnerDeliveriesProductsDto {
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
    contactPersonId: string;
    contactPersonName: string;
    contactPersonPhoneNumber: string;
    deliveryProductDtos: DeliveredProductDto[];
}

export interface DeliveredProductDto {
    name: string;
    category: string;
    quantity: number;
    unitId: string;
    unitAcronym: string;
    description: string;
    price: number;
    deliveryPrice: number;
    createdOn: string;
    modifiedOn: string;
}
