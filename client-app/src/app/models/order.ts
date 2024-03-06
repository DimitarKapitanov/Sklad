import { OrderProduct } from "./orderProduct";

export interface Order {
    id: string;
    isCompleted: boolean;
    completedDate: Date;
    orderCreated: Date;
    partnerId: string;
    partnerName: string;
    city: string;
    companyOwnerName: string;
    email: string;
    phone: string;
    address: string;
    bulstat: string;
    deliveryAddress: string;
    warehouseId: string;
    warehouseName: string;
    contactPersonId: string;
    contactPersonName: string;
    contactPersonPhoneNumber: string;
    orderProductDtos: Array<OrderProduct>;
    completedBy: string;
    createdBy: string;
}
