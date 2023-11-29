import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../models/product";
import agent from "../api/Agent";
import { v4 as uuid } from 'uuid';

export default class ProductStore {

    productRegistry = new Map<string, Product>();
    selectedProduct: Product | undefined = undefined;
    tableHeader: { key: string, label: string }[] = [
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
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get productsSort() {
        return Array.from(this.productRegistry.values());
    }

    loadProducts = async () => {
        this.setLoadingInitial(true);
        try {
            const products = await agent.Products.filterList();
            runInAction(() => {
                products.forEach(product => {
                    this.setProduct(product)
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

    private getProducts = (id: string) => {
        return this.productRegistry.get(id);
    }

    private setProduct = (product: Product) => {
        this.productRegistry.set(product.id, product);
    }

    loadProduct = async (id: string) => {
        let product = this.getProducts(id);
        if (product) {
            this.selectedProduct = product;
            return product;
        }
        else {
            this.setLoadingInitial(true);
            try {
                product = await agent.Products.details(id);
                this.setProduct(product);
                runInAction(() => this.selectedProduct = product);
                this.setLoadingInitial(false);
                return product;
            }
            catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createProduct = async (product: Product) => {
        this.loading = true;
        product.id = uuid();
        product.unitId = '00000000-0000-0000-0000-000000000001';
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
}