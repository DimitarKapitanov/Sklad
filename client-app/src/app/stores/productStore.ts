import { makeAutoObservable, reaction, runInAction } from "mobx";
import * as XLSX from "xlsx";
import agent from "../api/Agent";
import { tableHeaderProduct } from "../common/tableHeaders/tableHeaderProduct";
import Pagination, { PaginatedResult, PagingParams } from "../models/pagination";
import { Product, UploadedProduct } from "../models/product";
import { Delivery } from "../models/productsWithoutUnit";

export default class ProductStore {
  productRegistry = new Map<string, Product>();
  productPagingRegistry = new Map<string, Product[]>();
  searchRegister = new Map<string, Product[]>();
  category: string = "";
  categoryOptions: { key: string; text: string; value: string }[] = [];
  selectedProduct: Product | undefined = undefined;
  tableHeader = tableHeaderProduct;

  editMode = false;
  loading = false;
  loadingInitial = false;
  sortCategory: string = "category";
  sortDirection: "asc" | "desc" = "asc";

  filter: number = 0;
  pagination: Pagination | null = null;

  pagingParams = new PagingParams();
  predicate = new Map().set('all', true);

  setFilter = (value: number) => {
    this.filter = value;
  };

  setCategory = (value: string) => {
    if (this.category == "Всички") this.category = "";
    else this.category = value;
  };

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.productPagingRegistry.clear();
        this.searchRegister.clear();
        this.productRegistry.clear();
      }
    )
  }

  setPredicate = (predicate: string, value: string | number) => {
    const resetPredicate = () => {
      this.predicate.forEach((_, key) => {
        if (key !== 'search' && key !== "category") this.predicate.delete(key);
      })
    }

    switch (predicate) {
      case 'all':
        resetPredicate();
        this.predicate.set('all', true);
        break;
      case 'isZeroQuantity':
        resetPredicate();
        this.predicate.set('isZeroQuantity', true);
        break;
      case 'isDeleted':
        resetPredicate();
        this.predicate.set('isDeleted', true);
        break;
      case 'decreasingQuantity':
        resetPredicate();
        this.predicate.set('decreasingQuantity', value as number);
        break;
      case 'search':
        this.predicate.delete('search');
        this.predicate.set('search', value);
        break;
      case 'category':
        this.predicate.delete('category');
        this.predicate.set('category', value);
        break;
    }
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  }

  get pagedGroupedProducts() {
    if (this.pagination) {
      return this.productPagingRegistry.get(this.pagination.currentPage.toString()) || [];
    }
    return this.groupedProducts;
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === 'decreasingQuantity') {
        params.append(key, value);
      } else {
        params.append(key, value);
      }
    })
    return params;
  }

  get productsSort() {
    const products = Array.from(this.productRegistry.values()).sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    return products;
  }

  get products() {
    return Array.from(this.productRegistry.values());
  }

  get groupedProducts() {
    return this.productsSort.sort((a, b) => {
      const aValue = a['name'];
      const bValue = b['name'];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return this.sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return 0;
      }
    });
  }

  productAmount = (id: string) => {
    const amount = this.productRegistry.get(id)?.quantity;
    if (amount === undefined) return Number(0);

    return Number(amount);
  };

  sortProducts = (column: string) => {
    if (this.sortCategory === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortCategory = column;
      this.sortDirection = "asc";
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  loadProducts = async () => {
    const pageNumberKey = this.pagingParams.pageNumber.toString();
    const hasPageInProductPagingRegistry = this.productPagingRegistry.has(pageNumberKey);

    if (hasPageInProductPagingRegistry) {
      this.setPaginationToCurrentPage();
      return this.pagedGroupedProducts;
    }
    await this.fetchAndSetProducts();
  };

  private setPaginationToCurrentPage = () => {
    this.pagination!.currentPage = this.pagingParams.pageNumber;
  };

  private fetchAndSetProducts = async () => {
    this.setLoadingInitial(true);
    try {
      const result = await agent.Products.list(this.axiosParams);
      runInAction(() => {
        this.processFetchedProducts(result);
        this.setLoadingInitial(false);
      });
    } catch (error) {
      runInAction(() => {
        this.setLoadingInitial(false);
      });
      throw error;
    }
  };

  private processFetchedProducts = (result: PaginatedResult<Product[]>) => {
    result.data.map((product: Product) => {
      this.setProduct(product);
      return product;
    });
    this.setPagination(result.pagination);
    const currentPageKey = result.pagination.currentPage.toString();
    this.productPagingRegistry.set(currentPageKey, result.data);
  };

  getProducts = (id: string) => {
    return this.productRegistry.get(id);
  };

  private setProduct = (product: Product) => {
    if (product.unitDto) product.unitAcronym = product.unitDto.acronym!;
    this.productRegistry.set(product.id, product);
    if (this.categoryOptions.findIndex((x) => x.value === product.category) === -1) {
      this.categoryOptions.push({
        key: product.category,
        text: product.category,
        value: product.category,
      });
    }
  };

  loadProduct = async (id: string) => {
    this.setLoadingInitial(true);
    try {
      const product = await agent.Products.details(id);
      product.price = (product.price as unknown as number).toFixed(4);
      product.deliveryPrice = (product.deliveryPrice as unknown as number).toFixed(4);

      this.setProduct(product);
      runInAction(() => (this.selectedProduct = product));
      this.setLoadingInitial(false);
      return product;
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  createProduct = async (deliveryCompanyId: string, products: Product[]) => {
    this.loading = true;
    try {
      const delivery: Delivery = {
        deliveryCompanyId: deliveryCompanyId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        products: products.map(({ unitDto: _unit, ...rest }) => ({
          ...rest
        }))
      };
      await agent.Products.create(delivery);
      runInAction(() => {
        products.map(product => {
          this.productRegistry.set(product.id, product);
        })
        this.editMode = false;
        this.loading = false;
        this.productPagingRegistry.clear();
        this.searchRegister.clear();
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  uploadProducts = async (products: UploadedProduct[]) => {
    this.loading = true;
    try {
      await agent.Products.upload(products);
      runInAction(() => {
        this.loading = false;
        this.productPagingRegistry.clear();
        this.searchRegister.clear();
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateProduct = async (product: Product) => {
    this.loading = true;
    try {
      product.modifiedOn = new Date();
      await agent.Products.edit(product);
      runInAction(() => {
        this.productRegistry.set(product.id, product);

        // Update product in productPagingRegistry
        this.productPagingRegistry.get(this.pagingParams.pageNumber.toString())?.forEach((p, index) => {
          if (p.id === product.id) {
            this.productPagingRegistry.get(this.pagingParams.pageNumber.toString())![index] = product;
          }
        });

        this.selectedProduct = product;
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteProduct = async (id: string) => {
    this.loading = true;
    try {
      await agent.Products.delete(id);
      runInAction(() => {
        const product = this.productRegistry.get(id);
        if (product) product.isDeleted = true;
        this.productPagingRegistry.clear();
        this.productRegistry.set(id, product!);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  downloadProducts = () => {
    const data: unknown[] = [];
    this.products.map((product) => {
      data.push({
        Име: product.name,
        Количество: product.quantity,
        "Доставна цена": product.deliveryPrice,
        "Продажна цена": product.price,
        Категория: product.category,
        Мярка: product.unitAcronym,
        Описание: product.description,
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Продукти.xlsx");
  };
}

