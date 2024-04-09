import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/Agent";
import { NewOrderProduct } from "../models/newOrderProduct";
import { Order, OrderFormValues } from "../models/order";
import { OrderProduct, OrderProductEdit } from "../models/orderProduct";
import Pagination, { PagingParams } from "../models/pagination";
import { Product } from "../models/product";
import { store } from "./store";

export default class OrderStore {
    orderRegistry = new Map<string, Order>();
    pagedOrderRegistry = new Map<string, Order[]>();
    ordersProducts = new Map<string, OrderProduct[]>();

    productRegistry = new Map<string, Product>();
    productOptions: { key: string, text: string, value: string }[] = [];
    productAmount = 0;
    productPrice = 0;
    selectedProduct: NewOrderProduct | undefined = undefined;

    loadingOrders = false;
    loadingDetails = false;
    loadingCompleting = false;
    loadingCreateOrder = false;
    loading = false;
    sortCategory: keyof Order = 'partnerName';
    sortDirection: 'asc' | 'desc' = 'asc';
    filter: number = 0;

    filterClient: string = '';
    wareHouseFilter: string = '';
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);
    pagination: Pagination | null = null;
    localSearch: string = '';

    lastWarehouseId: string | undefined = undefined;
    lastUsername: string = '';

    sortCategoryDetails: keyof OrderProduct = 'categoryId';
    sortDirectionDetails: 'asc' | 'desc' = 'asc';
    selectedOrder: Order | undefined = undefined;

    activeIndex: string | undefined = undefined;

    tableHeader: { key: string, label: string }[] = [
        { key: "partnerName", label: "Фирма" },
        { key: "warehouseName", label: "Склад" },
        { key: "completedDate", label: "Дата" },
        { key: "isCompleted", label: "Статус" },
        { key: "details", label: "" },
    ];

    productTableHeader: { key: string, label: string }[] = [
        { key: "name", label: "Име" },
        { key: "category", label: "Категория" },
        { key: "unitAcronym", label: "Мярка" },
        { key: "quantity", label: "Количество" },
        { key: "price", label: "Единична цена" },
        { key: "total", label: "Общо без ДДС" },
        { key: "quantity", label: "ДДС" },
        { key: "totalPrice", label: "Крайна цена" },
    ];

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.pagedOrderRegistry.clear();
                this.orderRegistry.clear();
                this.loadOrdersByWarehouse(this.lastWarehouseId || '');
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setLastWarehouseId = (id: string) => {
        this.lastWarehouseId = id;
    }

    setPredicate = (predicate: string, value: string | number | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((_, key) => {
                if (key !== 'search' && key !== "warehouseId" && key !== "startDate" && key !== "endDate") this.predicate.delete(key);
            })
        }

        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isCompleted':
                resetPredicate();
                this.predicate.set('isCompleted', true);
                break;
            case 'isActive':
                resetPredicate();
                this.predicate.set('isActive', true);
                break;
            case 'search':
                this.predicate.delete('search');
                this.predicate.set('search', value);
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
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    };

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

    loadOrders = async () => {
        this.setLoadingDetails(true);
        try {
            const orders = await agent.Orders.list();
            runInAction(() => {
                orders.forEach(order => this.orderRegistry.set(order.id, order));
                this.setLoadingDetails(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingDetails(false);
            });
        }
    }

    loadOrder = async (id: string) => {
        if (this.selectedOrder && this.selectedOrder.id === id) return;

        const order: Order | undefined = this.orderRegistry.get(id);
        this.setLoadingDetails(true);
        try {
            const orderDetailed = await agent.Orders.details(id);
            runInAction(() => {
                if (!order) {
                    this.orderRegistry.set(orderDetailed.id, orderDetailed);
                }
                this.ordersProducts.set(orderDetailed.id, orderDetailed.orderProductDtos);
                this.selectedOrder = orderDetailed;

                this.setLoadingDetails(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingDetails(false);
            });
        }
    }

    loadOrdersByUsername = async (username: string) => {
        // const pageNumberKey = this.pagingParams.pageNumber.toString();
        // const hasPageInOrderPagingRegistry = this.pagedOrderRegistry.has(pageNumberKey);
        // const hasDifferentUser = Array.from(this.pagedOrderRegistry.values()).flat().some(order => order && order.contactPersonName && order.contactPersonName !== username);

        // // if the username is different from the last one, clear the pagedOrderRegistry and the pagingParams
        // if (this.lastUsername !== username || hasDifferentUser) {
        //     this.pagedOrderRegistry.clear();
        //     this.pagingParams = new PagingParams();
        // }

        // //if the page is already in the registry and the username is the same as the last one, set the pagination to the current page
        // if (hasPageInOrderPagingRegistry && this.lastUsername === username && !hasDifferentUser) {
        //     this.setPaginationToCurrentPage();
        //     return this.pagedOrderRegistry;
        // }

        this.setLoadingOrders(true);
        try {
            if (username) {
                this.axiosParams.set('username', username);
            }
            const result = await agent.Orders.listByUsername(this.axiosParams);
            runInAction(() => {
                this.pagedOrderRegistry.set(result.pagination.currentPage.toString(), result.data);
                this.setPagination(result.pagination);
                this.lastUsername = username;
                this.setLoadingOrders(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingOrders(false);
            });
        }
    }

    loadOrdersByWarehouse = async (id: string) => {
        //check if pagedOrderRegistry has the warehouseId
        const allWarehouseIdsMatch = Array.from(this.pagedOrderRegistry.values())
            .every(orders => orders.every(order => order.warehouseId === id));
        if (this.lastWarehouseId !== id || !allWarehouseIdsMatch) {
            this.pagedOrderRegistry.clear();
            this.pagingParams = new PagingParams();
        }

        //if the page is already in the registry and the warehouseId is the same as the last one, set the pagination to the current page
        const pageNumberKey = this.pagingParams.pageNumber.toString();
        const hasPageInOrderPagingRegistry = this.pagedOrderRegistry.has(pageNumberKey);
        if (hasPageInOrderPagingRegistry && this.lastWarehouseId === id) {
            this.setPaginationToCurrentPage();
            return this.pagedOrderRegistry;
        }

        this.setLoadingOrders(true);
        try {
            const result = await agent.Orders.listByWarehouse(id, this.axiosParams);
            runInAction(() => {
                this.pagedOrderRegistry.set(result.pagination.currentPage.toString(), result.data);
                this.setPagination(result.pagination);
                this.setLastWarehouseId(id);
                this.setLoadingOrders(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingOrders(false);
            });
        }
    }

    get ordersByWarehouse() {
        if (this.pagination) {
            return this.pagedOrderRegistry.get(this.pagination.currentPage.toString());
        }
    }

    private setPaginationToCurrentPage = () => {
        this.pagination!.currentPage = this.pagingParams.pageNumber;
    };

    version = 0;

    get filteredOrders() {
        return Array.from(this.orderRegistry.values()).filter(order => {
            if (this.filter === 1) return order.isCompleted;
            if (this.filter === 2) return !order.isCompleted;
            return true;
        });
    }

    get groupedOrders() {
        this.version;
        const groups = new Map<string, Order[]>();
        this.sortedOrders.forEach(order => {
            if ((!this.filterClient || this.filterClient === 'all' || order.partnerId === this.filterClient) &&
                (!this.wareHouseFilter || this.wareHouseFilter === 'all' || order.warehouseId === this.wareHouseFilter)) {
                const key = order['warehouseName'];
                const collection = groups.get(key);
                if (!collection) {
                    groups.set(key, [order]);
                } else {
                    collection.push(order);
                }
            }
        });
        return Array.from(groups.entries());
    }

    get sortedOrders() {
        this.version;
        return this.filteredOrders.sort((a, b) => {
            const aValue = a[this.sortCategory];
            const bValue = b[this.sortCategory];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                return this.sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return this.sortDirection === 'asc' ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
            } else {
                return 0;
            }
        });
    }

    get getOrderByUser() {
        if (this.pagination) {
            return this.pagedOrderRegistry.get(this.pagination.currentPage.toString());
        }
    }

    sortOrders = (column: string) => {
        const validKeys = this.tableHeader.map(header => header.key);
        if (validKeys.includes(column)) {
            if (this.sortCategory === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortCategory = column as keyof Order;
                this.sortDirection = 'asc';
            }
        }
        this.version++;
    }

    deleteOrder = async (id: string) => {
        try {
            if (!id) return;
            await agent.Orders.delete(id);
            runInAction(() => {
                this.orderRegistry.delete(id);

                // Delete the order from pagedOrderRegistry
                this.pagedOrderRegistry.forEach((orders, key) => {
                    const updatedOrders = orders.filter(order => order.id !== id);
                    if (updatedOrders.length !== orders.length) {
                        if (updatedOrders.length > 0) {
                            this.pagedOrderRegistry.set(key, updatedOrders);
                        } else {
                            this.pagedOrderRegistry.delete(key);
                        }
                    }
                });
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (orderId: string, productId: string) => {
        this.loading = true;
        try {
            if (!orderId || !productId) return;
            await agent.Orders.deleteProduct(orderId, productId);
            runInAction(() => {
                const order = this.orderRegistry.get(orderId);
                if (order && order.orderProductDtos && order.orderProductDtos.length > 0) {
                    const products = order.orderProductDtos.find(product => product.productId === productId);
                    if (products) {
                        order.orderProductDtos = order.orderProductDtos.filter(product => product.productId !== productId);
                        this.orderRegistry.set(orderId, order);
                        this.selectedOrder = order;
                    }
                    this.loading = false;
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    completeOrder = async (id: string) => {
        this.loading = true;
        if (!id) return;
        try {
            await agent.Orders.complete(id);
            runInAction(() => {
                const order = this.orderRegistry.get(id);
                if (order) {
                    order.isCompleted = true;
                    this.orderRegistry.set(id, order);
                    this.pagedOrderRegistry.forEach(orders => {
                        orders.forEach(order => {
                            if (order.id === id) {
                                order.isCompleted = true;
                            }
                        });
                    });
                    if (this.selectedOrder && this.selectedOrder.id === id) {
                        this.selectedOrder.isCompleted = true;
                    }
                    this.loading = false;
                }
            });
        }
        catch (error) {
            console.log(error);
            this.loading = false;
        }
        this.setLoadingComplete(false);
    }

    createOrder = async (order: OrderFormValues) => {
        console.log(order);

        this.loading = true;
        return await new Promise((resolve) => {
            agent.Orders.CreateOrder(order)
                .then(() => {
                    runInAction(() => {
                        this.orderRegistry.set(order.id, (order as unknown) as Order);
                        this.clearOrderProducts();
                        this.pagedOrderRegistry.clear();
                        this.setLastWarehouseId(order.warehouseId);
                        this.loading = false;
                    });
                    store.warehouseStore.clearSelectedWareHouse();
                    store.partnerStore.clearSelectedPartner();
                    this.clearOrderProducts();
                    resolve(order.id);
                })
                .catch((error) => {
                    toast.error("Възникна грешка при създаването на поръчката!");
                    console.log(error);
                    runInAction(() => {
                        this.loading = false;
                    });
                    throw new Error(error);
                });
        });
    }

    updateOrderProduct = async (orderProduct: OrderProductEdit) => {
        this.loading = true;
        try {
            await agent.Orders.edit(orderProduct);
            runInAction(() => {
                const order = this.orderRegistry.get(orderProduct.orderId);
                if (order) {
                    // const product = order.orderProductDtos.find(product => product.id === orderProduct.id);
                    const product = order.orderProductDtos.find(product => product.id === orderProduct.id);
                    if (product) {
                        product.quantity = orderProduct.quantity;
                        product.totalPrice = orderProduct.totalPrice;
                        product.price = orderProduct.price;
                        this.orderRegistry.set(order.id, order);
                        this.selectedOrder = order;
                        this.loading = false;
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
            this.loading = false;
        }
    }

    get sortedOrderProducts() {
        const products = this.selectedOrder?.orderProductDtos;
        if (!products) return [];

        return Array.from(products.values()).sort((a, b) => {
            const aValue = a[this.sortCategoryDetails];
            const bValue = b[this.sortCategoryDetails];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this.sortDirectionDetails === 'asc' ? aValue - bValue : bValue - aValue;
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                return this.sortDirectionDetails === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return 0;
            }
        });
    }

    sortOrderProducts = (column: string) => {
        const validKeys = this.productTableHeader.map(header => header.key);
        if (validKeys.includes(column) && this.sortCategoryDetails === column) {
            this.sortDirectionDetails = this.sortDirectionDetails === 'asc' ? 'desc' : 'asc';
        } else if (validKeys.includes(column)) {
            this.sortCategoryDetails = column as keyof OrderProduct;
            this.sortDirectionDetails = 'asc';
        }
    }

    loadOptions = async () => {
        this.setCreateOrderLoading(true);
        this.loadProducts();
        this.setCreateOrderLoading(false);
    }

    loadProducts = async (data?: string) => {
        try {
            store.productStore.axiosParams.set('search', data || '');
            const result = await agent.Products.list(store.productStore.axiosParams);
            runInAction(() => {
                result.data.map(product => {
                    if (product.quantity === 0) return;
                    this.setProduct(product)
                })
                if (data) {
                    // this.setProductOptions(data);
                    this.productOptions = [...this.productOptions, ...result.data.map(product => {
                        return {
                            key: product.id,
                            text: product.name + ' - ' + product.unitAcronym,
                            value: product.id
                        }
                    })];
                } else {
                    this.productOptions = [];
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    private setProduct = (product: Product) => {
        product.unitAcronym = product.unitDto.acronym!;
        this.productRegistry.set(product.id, product);
    }

    clearProductOptions = () => {
        this.productOptions = [];
    }

    orderProducts = new Map<string, NewOrderProduct>();

    clearOrderProducts = () => {
        this.orderProducts.clear();
        this.selectedProduct = undefined;
        this.productAmount = 1;
        this.clearProductOptions();
    }

    private getProduct = (id: string) => {
        return this.productRegistry.get(id);
    }

    selectProduct = (id: string) => {
        const product = this.getProduct(id);
        this.productPrice = Number(product?.price) || 0;
        if (product) {
            this.selectedProduct = {
                id: product.id,
                orderId: '',
                productId: product.id,
                name: product.name,
                category: product.categoryName,
                categoryId: product.categoryId,
                quantity: product.quantity,
                unitId: product.unitId,
                unitAcronym: product.unitAcronym,
                description: product.description,
                price: product.price,
                totalPrice: (parseFloat(product.price) * this.productAmount).toString(),
            } as NewOrderProduct;
        } else {
            this.selectedProduct = undefined;
        }
    }

    setProductAmount = (quantity: number) => {
        if (quantity > 0) {
            this.productAmount = quantity;
        } else {
            this.productAmount = quantity;
        }
    }

    setProductPrice = (price: number) => {
        if (price > 0 && this.selectedProduct) {
            this.productPrice = price;
        } else {
            this.productPrice = price;
        }
    }

    cancelOrder = () => {
        this.clearOrderProducts();
        store.warehouseStore.clearSelectedWareHouse();
        store.partnerStore.clearSelectedPartner();
    }

    clearSelectedProduct = () => {
        this.selectedProduct = undefined;
    }

    setLoadingOrders = (state: boolean) => {
        this.loadingOrders = state;
    }

    setLoadingDetails = (state: boolean) => {
        this.loadingDetails = state;
    }

    setLoadingComplete = (state: boolean) => {
        this.loadingCompleting = state;
    }

    setFilter = (filter: number) => {
        this.filter = filter;
    }

    setCreateOrderLoading = (state: boolean) => {
        this.loadingCreateOrder = state;
    }

    setFilterClient = (client: string) => {
        this.filterClient = client;
    }

    setWareHouseFilter = (warehouse: string) => {
        this.wareHouseFilter = warehouse;
    }

    addProduct = (selectedProduct: NewOrderProduct): boolean => {
        selectedProduct.quantity = this.productAmount;
        selectedProduct.price = this.productPrice.toString();
        const product = this.productRegistry.get(selectedProduct.productId);
        if (product) {
            if (product.quantity - selectedProduct.quantity < 0) {
                this.clearSelectedProduct();
                this.setProductPrice(0);
                this.setProductAmount(1);
                return false;
            }
            runInAction(() => {
                product.quantity -= selectedProduct.quantity;
                this.productRegistry.set(selectedProduct.productId, product);
            });
        }
        this.setProductPrice(0);
        this.setProductAmount(0);
        return true;
    };

    removeProduct = (id: string, productToRemove: NewOrderProduct) => {
        const product = this.productRegistry.get(id);
        if (product) {
            product.quantity += productToRemove.quantity;
            this.productRegistry.set(productToRemove.productId, product);
        }
    };

    setActiveIndex = (id: string) => {
        this.activeIndex = id;
    }

    setLastUsername = (username: string) => {
        this.lastUsername = username;
    }

    clearPagedOrderRegistry = () => {
        this.pagedOrderRegistry.clear();
    }
}