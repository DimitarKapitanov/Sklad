export interface NewPartner {
    id: string;
    companyId: string;
    createCompanyDto: {
        id: string;
        name: string;
        city: string;
        address: string;
        bulstat: string;
        phone: string;
        email: string;
        companyOwnerName: string;
    };
    phone: string;
    email: string;
    deliveryAddresses: {
        id: string;
        partnerId: string;
        city: string;
        address: string;
    }[];
    isDelivery: boolean;
    isClient: boolean;
}