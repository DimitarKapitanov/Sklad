import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/Agent";
import { tableHeaderDeliveredProducts } from "../common/tableHeaders/tableHeaderDeliveredProducts";
import { tableHeadersProductInfo } from "../common/tableHeaders/tableHeaderProductInfo";
import Pagination, { PagingParams } from "../models/pagination";
import { Partner } from "../models/partner";
import { DeliveredProducts, SoldProducts } from "../models/statistics";

export default class StatisticsStore {
    deliveredProductRegistry = new Map<string, DeliveredProducts[]>();
    soldProductRegistry = new Map<string, SoldProducts[]>();
    loadingInitial = false;
    sortColumn: string | string = '';
    sortDirection: 'asc' | 'desc' | null = null;
    tableHeadersDeliveredProducts = tableHeaderDeliveredProducts;
    tableHeadersProductInfo = tableHeadersProductInfo;
    supplierInfo: Partner | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('sales', true);
    pagination: Pagination | null = null;
    selectedCompanyId: string = '';

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                if (this.predicate.has('sales')) this.soldProductRegistry.clear();
                if (this.predicate.has('deliveries')) {
                    this.deliveredProductRegistry.clear();
                    if (this.selectedCompanyId) {
                        this.loadingDeliveredProducts(this.selectedCompanyId);
                    }
                }
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    };

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    };

    setPredicate = (predicate: string, value: string | number | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((_, key) => {
                if (key !== 'search') this.predicate.delete(key);
            })
        }

        switch (predicate) {
            case 'sales':
                resetPredicate();
                this.predicate.set('sales', true);
                break;
            case 'deliveries':
                resetPredicate();
                this.predicate.set('deliveries', true);
                break;
            case 'warehouseId':
                this.predicate.delete('warehouseId');
                this.predicate.set('warehouseId', value);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
            case 'endDate':
                this.predicate.delete('endDate');
                this.predicate.set('endDate', value);
                break;
            case 'search':
                this.predicate.delete('search');
                this.predicate.set('search', value);
                break;
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
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

    get deliveredProductSort() {
        if (this.pagination) return this.deliveredProductRegistry.get(this.pagination.currentPage.toString());
    }

    get soldProductSort() {
        if (this.pagination) return this.soldProductRegistry.get(this.pagination.currentPage.toString());
    }

    sortStatistics = (column: string) => {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }

    setSelectCompanyId = (id: string) => {
        this.selectedCompanyId = id;
    }

    private setDeliveredProductStatistics = (deliveryStatistic: DeliveredProducts[]) => {
        if (this.pagination) this.deliveredProductRegistry.set(this.pagination.currentPage.toString(), deliveryStatistic);
    }

    private setSoldProductStatistics = (soldProductsStatistic: SoldProducts[]) => {
        if (this.pagination) this.soldProductRegistry.set(this.pagination?.currentPage.toString(), soldProductsStatistic);
    }

    loadingDeliveredProducts = async (id: string) => {
        this.setLoadingInitial(true);
        try {
            const currentPageData = this.deliveredProductRegistry.get(this.pagingParams.pageNumber.toString());

            if (currentPageData) {
                const hasMatchingPartnerId = currentPageData.some(p => p.partnerId === id);

                if (hasMatchingPartnerId) {
                    this.loadingInitial = false;
                    this.pagination!.currentPage = this.pagingParams.pageNumber;
                    return this.deliveredProductRegistry;
                }

                this.deliveredProductRegistry.clear();
                this.pagingParams = new PagingParams();
            }

            if (id) this.axiosParams.append('partnerId', id);

            const result = await agent.Statistic.filterDeliveries(this.axiosParams);

            runInAction(() => {
                this.setPagination(result.pagination);
                this.setDeliveredProductStatistics(result.data);
                this.loadingInitial = false;
            });
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            });
            throw error;
        }
    }

    loadSoldProducts = async () => {
        this.setLoadingInitial(true);
        const pageNumberKey = this.pagingParams.pageNumber.toString();
        const hasPageInOrderPagingRegistry = this.soldProductRegistry.has(pageNumberKey);

        if (hasPageInOrderPagingRegistry) {
            this.setPaginationToCurrentPage();
            return this.soldProductRegistry.get(pageNumberKey);
        }

        try {
            const response = await agent.Statistic.filterSoldProducts(this.axiosParams);

            runInAction(() => {
                this.setPagination(response.pagination);
                this.setSoldProductStatistics(response.data);
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            });
            throw error;
        }
    };

    loadSupplierInfo = async (id: string) => {
        this.setLoadingInitial(true);
        try {
            const result = await agent.Partner.details(id);
            runInAction(() => {
                this.supplierInfo = result;
                this.loadingInitial = false;
            });
            return result;
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            });
            throw error;
        }
    }

    private setPaginationToCurrentPage = () => {
        this.pagination!.currentPage = this.pagingParams.pageNumber;
    };

    formatDateTime = (date: Date | string): string => {
        return new Date(date).toLocaleString('bg-BG', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }
}