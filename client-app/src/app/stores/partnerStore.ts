import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/Agent";
import { NewPartner } from "../models/newPartner";
import { Order } from "../models/order";
import Pagination, { PagingParams } from "../models/pagination";
import { Partner, PartnerDeliveriesProductsDto } from "../models/partner";

export default class PartnerStore {

    partnerRegistry = new Map<string, Partner>();
    partnerOptions: { key: string, text: string, value: string }[] = [];
    partnerOrdersRegistry = new Map<string, Order>();
    partnerDeliversRegistry = new Map<string, PartnerDeliveriesProductsDto>();
    loadingInitial = false;
    selectedPartner: Partner | undefined = undefined;
    loading = false;

    search: string = '';

    pagingParams = new PagingParams();
    primaryPredicate = new Map().set('all', true);
    secondaryPredicate = new Map().set('allOrders', true);

    partnerDashboardPagination: Pagination | null = null;
    partnerOrdersPagination: Pagination | null = null;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.primaryPredicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.partnerRegistry.clear();
            }
        )

        reaction(
            () => this.secondaryPredicate.keys(),
            () => {
                this.pagingParams = new PagingParams();

                this.partnerOrdersPagination = null;

                const { selectedPartner } = this;
                if (selectedPartner) {

                    if (selectedPartner.isClient) {
                        this.partnerOrdersRegistry.clear();
                        this.loadPartnerOrders(selectedPartner.id);
                    }
                    if (selectedPartner.isSupplier) {
                        this.partnerDeliversRegistry.clear();
                        this.loadPartnerDelivers(selectedPartner.id);
                    }
                }
            }
        )
    }

    get partners() {
        return Array.from(this.partnerRegistry.values());
    }

    get sortedPartners() {
        return Array.from(this.partnerRegistry.values()).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    dateString = (date: Date | null) => {
        if (date === null) return "";
        const dateToString = new Date(date);
        return dateToString.toLocaleString('bg-BG', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(',', '');
    }

    setPrimaryPredicate = (primaryPredicate: string, value: string) => {
        const resetPredicate = () => {
            this.primaryPredicate.forEach((_, key) => {
                if (key !== 'search') this.primaryPredicate.delete(key);
            })
        }
        switch (primaryPredicate) {
            case 'all':
                resetPredicate();
                this.primaryPredicate.set('all', value);
                break;
            case 'isClient':
                resetPredicate();
                this.primaryPredicate.set('isClient', value);
                break;
            case 'isSupplier':
                resetPredicate();
                this.primaryPredicate.set('isSupplier', value);
                break;
            case 'search':
                this.secondaryPredicate.delete('search');
                this.secondaryPredicate.set('search', value);
                break;
        }
    }

    setSecondaryPredicate = (secondaryPredicate: string, value: string | Date | null) => {
        const resetPredicate = () => {
            this.secondaryPredicate.forEach((_, key) => {
                if (key !== 'searchBy' && key !== "startDate" && key !== "endDate") this.secondaryPredicate.delete(key);
            })
        }
        switch (secondaryPredicate) {
            case 'allOrders':
                resetPredicate();
                this.secondaryPredicate.set('allOrders', true);
                break;
            case 'isCompleted':
                resetPredicate();
                this.secondaryPredicate.set('isCompleted', true);
                break;
            case 'isActive':
                resetPredicate();
                this.secondaryPredicate.set('isActive', true);
                break;
            case 'startDate':
                if (value === null) {
                    this.secondaryPredicate.delete('startDate');
                    break;
                } else {
                    this.secondaryPredicate.delete('startDate');
                    this.secondaryPredicate.set('startDate', value);
                }
                break;
            case 'endDate':
                if (value === null) {
                    this.secondaryPredicate.delete('endDate');
                    break;
                } else {
                    this.secondaryPredicate.delete('endDate');
                    this.secondaryPredicate.set('endDate', value);
                }
                break;
            case 'searchBy':
                this.secondaryPredicate.delete('searchBy');
                this.secondaryPredicate.set('searchBy', value);
                break;
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.primaryPredicate.forEach((value, key) => {
            if (value !== null) {
                params.append(key, value);
            }
        })
        this.secondaryPredicate.forEach((value, key) => {
            if (value !== null) {
                if (key === 'startDate' || key === 'endDate') {
                    params.append(key, (value as Date).toLocaleString());
                } else {
                    params.append(key, value);
                }
            }
        })
        return params;
    }

    setPartnerDashboardPagination = (pagination: Pagination) => {
        this.partnerDashboardPagination = pagination;
    }

    setPartnerOrdersPagination = (pagination: Pagination) => {
        this.partnerOrdersPagination = pagination;
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    loadPartners = async () => {
        try {
            const result = await agent.Partner.list(this.axiosParams);
            runInAction(() => {
                result.data.map(partner => {
                    this.setPartners(partner);
                });
                this.setPartnerDashboardPagination(result.pagination);
            })
        } catch (error) {
            console.log(error);
        }
    };

    loadPartner = async (id: string) => {
        let partner = this.getPartner(id);

        if (partner) {
            this.selectedPartner = partner;
            return partner;
        }

        this.setLoadingInitial(true);
        try {
            partner = await agent.Partner.details(id);
            runInAction(() => {
                this.setPartners(partner);
                this.selectedPartner = partner
                this.setLoadingInitial(false);
            });
            return partner;
        } catch (error) {
            console.log(error);
            runInAction(() => this.setLoadingInitial(false));
        }

    };

    loadPartnerOrders = async (id: string) => {
        if (this.partnerOrdersPagination === null) {
            this.axiosParams.set('pageNumber', new PagingParams().pageNumber.toString());
        }

        try {
            const result = await agent.Partner.partnerOrders(id, this.axiosParams);
            runInAction(() => {
                this.setPartnerOrdersPagination(result.pagination);
                result.data.map(order => {
                    this.setPartnersOrder(order);
                });
                this.selectedPartner = this.partnerRegistry.get(id);
            });
        } catch (error) {
            console.log(error);
        }
    }

    loadPartnerDelivers = async (id: string) => {
        try {
            const result = await agent.Partner.partnerDeliveries(id, this.axiosParams);
            runInAction(() => {
                this.setPartnerOrdersPagination(result.pagination);
                result.data.map(deliveries => {
                    this.setPartnerDelivers(deliveries);
                });
                this.selectedPartner = this.partnerRegistry.get(id);
            });
        } catch (error) {
            console.log(error);
        }
    }

    createPartner = async (partner: NewPartner) => {
        this.loading = true;
        try {
            // if (partner.isDelivery) {
            // }
            // else {
            await agent.Partner.create(partner);
            runInAction(() => {
                const newPartner = {} as Partner;
                newPartner.id = partner.id;
                newPartner.name = partner.createCompanyDto.name;
                newPartner.phone = partner.phone;
                newPartner.email = partner.email;
                newPartner.city = partner.createCompanyDto.city;
                newPartner.address = partner.createCompanyDto.address;
                newPartner.bulstat = partner.createCompanyDto.bulstat;
                newPartner.companyOwnerName = partner.createCompanyDto.companyOwnerName;
                this.partnerRegistry.set(newPartner.id, newPartner);
                this.selectedPartner = newPartner;
                this.loading = false;
            })
            // }
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    };

    getPartner(id: string) {
        return this.partnerRegistry.get(id);
    }

    get partnerOrders() {
        return Array.from(this.partnerOrdersRegistry.values());
    }

    get partnerDelivers() {
        return Array.from(this.partnerDeliversRegistry.values());
    }

    // private shouldClearRegistry() {
    //     this.pagingParams = new PagingParams();
    //     this.partnerOrdersRegistry.clear();
    // }
    // private shouldClearPartnerDelivers() {
    //     this.pagingParams = new PagingParams();
    //     this.partnerDeliversRegistry.clear();

    // }
    private setPartnerDelivers(delivers: PartnerDeliveriesProductsDto | undefined) {
        if (delivers) {
            this.partnerDeliversRegistry.set(delivers.id, delivers);
        }
    }
    private setPartnersOrder(orders: Order | undefined) {
        if (orders) {
            this.partnerOrdersRegistry.set(orders.id, orders);
        }
    }

    private setPartners(partner: Partner | undefined) {
        if (partner) {
            this.partnerRegistry.set(partner.id, partner);
            this.partnerOptions.push({
                key: partner.id,
                text: partner.name,
                value: partner.id
            });
        }
    }

    // private clearPartnerOptions = () => {
    //     this.partnerOptions = [];
    // };

    selectPartner = (id: string) => {
        const partner = this.partnerRegistry.get(id);
        if (partner) {
            this.selectedPartner = partner;
        }
    };

    clearSelectedPartner = () => {
        this.selectedPartner = undefined;
        this.partnerOrdersRegistry.clear();
        this.partnerDeliversRegistry.clear();
        this.setSecondaryPredicate('allOrders', 'true');
    };

    setSearch = (search: string) => {
        this.search = search;
    }
}