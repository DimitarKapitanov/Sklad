import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/Agent";
import Pagination, { PagingParams } from "../models/pagination";
import { Supplier } from "../models/supplier";

export default class SupplierStore {
    supplierRegistry = new Map<string, Supplier[]>();
    supplierOptions: { key: string, text: string, value: string }[] = [];

    loadingInitial = false;

    pagingParams = new PagingParams();
    predicate = new Map().set('deliveries', true);
    pagination: Pagination | null = null;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.supplierRegistry.clear();
                this.loadSuppliers();
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
            case 'deliveries':
                resetPredicate();
                this.predicate.set('deliveries', true);
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

    get getSuppliers() {
        if (this.pagination) {
            return this.supplierRegistry.get(this.pagination?.currentPage.toString());
        }
    }

    loadSuppliers = async () => {
        try {
            const result = await agent.Suppliers.list(this.axiosParams);
            runInAction(() => {
                this.setPagination(result.pagination);
                this.setSuppliers(result.data);
                this.setSupplierOptions();
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
            });
        }
    };

    setSupplierOptions = () => {
        const suppliers = this.supplierRegistry.get(this.pagination!.currentPage.toString());
        if (suppliers) suppliers.forEach(s => this.supplierOptions.push({ key: s.id, text: s.name, value: s.id }));
    }

    private setSuppliers(supplier: Supplier[]) {
        if (this.pagination) this.supplierRegistry.set(this.pagination?.currentPage.toString(), supplier);
    }

    clearSupplierOptions = () => {
        this.supplierOptions = [];
    }

    clearSupplier = () => {
        this.supplierRegistry.clear();
    };
}