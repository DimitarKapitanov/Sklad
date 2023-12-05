import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../models/product";
import agent from "../api/Agent";

export default class ProductStore {
    productRegistry = new Map<string, Product>();
    lastAddedProducts = new Map<string, Product>();
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
    sortCategory: string = 'category';
    sortDirection: 'asc' | 'desc' = 'asc';

    constructor() {
        makeAutoObservable(this);
    }

    get productsSort() {
        const products = Array.from(this.productRegistry.values()).sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        return products;
    }

    get groupedProducts() {
        const sortedProducts = [...this.productsSort].sort((a, b) => {
            const aValue = a[this.sortCategory as keyof Product];
            const bValue = b[this.sortCategory as keyof Product];
    
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                return this.sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return 0;
            }
        });

        return Object.entries(
            sortedProducts.reduce((products, product) => {
                const category = product.category;
                products[category] = products[category] ? [...products[category], product] : [product];
                return products;
            }, {} as { [key: string]: Product[] })
        );
    }

    get latestProducts() {
        return Array.from(this.lastAddedProducts.values());
    }

    sortProducts = (column: string) => {
        if (this.sortCategory === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortCategory = column;
            this.sortDirection = 'asc';
        }
    }

    loadProducts = async () => {
        this.setLoadingInitial(true);
        try {
            const products = await agent.Products.filterList();
            runInAction(() => {
                products.forEach(product => {
                    product.unitAcronym = product.unit.acronym;
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

    createProduct = async (products: Product[]) => {
        this.loading = true;
        try {
            await agent.Products.create(products);
            runInAction(() => {
                for (const product of products) {
                    this.productRegistry.set(product.id, product);
                    this.lastAddedProducts.set(product.id, product);
                }
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
            await agent.Products.edit(product);
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