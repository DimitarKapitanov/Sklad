export interface SelectedWarehouse {
  id: string;
  name: string;
  contactPersonId: string | null;
  description: string | null;
  ordersByWarehouse: Array<OrdersByWarehouse>;
}

export interface OrdersByWarehouse {
  id: string;
  isCompleted: boolean;
  completedDate: Date | null;
  partnerId: string;
  partnerName: string;
  city: string;
  companyOwnerName: string;
  email: string;
  phone: string;
  address: string;
  vat: string;
  deliveryAddress: string;
  warehouseId: string;
  warehouseName: string;
  createdOn: Date | null;
  warehouseOrderProductDtos: Array<OrderProduct>;
}

interface OrderProduct {
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
}
