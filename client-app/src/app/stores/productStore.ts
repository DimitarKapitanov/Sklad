import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../models/product";
import agent from "../api/Agent";
import { v4 as uuid } from 'uuid';

export default class ProductStore {
   
    productRegistry = new Map<string, Product>();
    selectedProduct: Product | undefined = undefined;
    tableHeader: {key: string, label: string}[] = [
        { key: "name", label: "Име" },
        { key: "quantity", label: "Количество" },
        { key: "deliveryPrice", label: "Доставна цена" },
        { key: "price", label: "Продажна цена" },
        { key: "category", label: "Категория" },
        { key: "unitAcronym", label: "Мярка" },
        { key: "description", label: "Описание" },
        { key: "isDeleted", label: "Edit/Delete" }
    ];
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get productsSort() {
        return Array.from(this.productRegistry.values());
    }

    loadProducts = async () => {
        try {
            const products = await agent.Products.filterList();
            runInAction(() => {
                products.forEach(product => {
                    this.productRegistry.set(product.id, product);
                })

                this.loadingInitial = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            })
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectProduct = (id: string) => {
        this.selectedProduct = this.productRegistry.get(id);
    }

    cancelSelectedProduct = () => {
        this.selectedProduct = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectProduct(id) : this.cancelSelectedProduct();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createProduct = async (product: Product) => {
        this.loading = true;
        product.id = uuid();
        try {
            await agent.Products.create(product);
            runInAction(() => {
                this.productRegistry.set(product.id, product);
                this.selectedProduct = product;
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateProduct = async (product: Product) => {
        this.loading = true;
        try {
            product.unitId = '00000000-0000-0000-0000-000000000001';
            await agent.Products.update(product);
            runInAction(() => {
                this.productRegistry.set(product.id, product);
                this.selectedProduct = product;
                this.editMode = false;
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteProduct = async (id: string) => {
        this.loading = true;
        try {
            await agent.Products.delete(id);
            runInAction(() => {
                this.productRegistry.delete(id);
                if (this.selectedProduct?.id === id) this.cancelSelectedProduct();
                this.loading = false;
            })
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    // loadAllProducts = async () => {
    //     this.loadingInitial = true;
    //     try {
    //         const products = await agent.Products.list();
    //         products.forEach(product => {
    //             this.products.push(product);
    //         })
    //         this.loadingInitial = false;
    //     }
    //     catch (error) {
    //         console.log(error);
    //         this.loadingInitial = false;
    //     }
    // }
}