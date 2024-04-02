import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Category } from "../models/category";
import { NewOrder } from "../models/newOrder";
import { NewPartner } from "../models/newPartner";
import { Order } from "../models/order";
import { OrderProductEdit } from "../models/orderProduct";
import { PaginatedResult } from "../models/pagination";
import { PartnerDeliveriesProductsDto, Partner as PartnerModel } from "../models/partner";
import { Product, UploadedProduct } from "../models/product";
import { Delivery } from "../models/productsWithoutUnit";
import { Photo, Profile } from "../models/profile";
import Role from "../models/role";
import { SelectedWarehouse } from "../models/selectedWarehouse";
import { DeliveredProducts, SoldProducts, Statistics } from "../models/statistics";
import { Supplier } from "../models/supplier";
import { Unit } from "../models/unit";
import { NewUserFormValues, User, UserFormValues, UserInfo } from "../models/user";
import { WarehouseEditValues, Warehouse as WarehouseModel } from "../models/warehouse";
import { store } from "../stores/store";
import { router } from "./router/Routes";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));
      return response as AxiosResponse<PaginatedResult<unknown>>;
    }
    return response;
  }, (error: AxiosError) => {
    const { data, status, config, headers } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (
          config.method === "get" &&
          Object.prototype.hasOwnProperty.call(data.errors, "id")
        ) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }

          throw modalStateErrors.flat();
        } else if (data.Errors) {
          const modalStateErrors = [];
          for (const key in data.Errors) {
            if (data.Errors[key]) {
              modalStateErrors.push(data.Errors[key].ErrorMessage);
            }
          }

          throw modalStateErrors.flat();
        } else {
          toast.error(data);
        }
        break;
      case 401:
        if (status === 401 && headers["www-authenticate"]?.startsWith('Bearer error="invalid_token"')) {
          store.userStore.logout();
          toast.error("Сесията изтече, моля влезте отново!")
        }
        toast.error("Неоторизиран достъп!");
        break;
      case 403:
        toast.error("Забранен достъп!");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.serverError(data);
        router.navigate("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/ban-types
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  // eslint-disable-next-line @typescript-eslint/ban-types
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Products = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<Product[]>>("/products", { params })
    .then(responseBody),
  filterList: (params: URLSearchParams) => axios.get<PaginatedResult<Product[]>>(`/products/filtered/${false}`, { params })
    .then(responseBody),
  details: (id: string) => requests.get<Product>(`/products/${id}`),
  create: (delivery: Delivery) => requests.post<void>("/products", delivery),
  edit: (product: Product) => requests.put<void>(`/products/${product.id}`, product),
  delete: (id: string) => requests.delete<void>(`/products/${id}`),
  upload: (products: UploadedProduct[]) => requests.post<void>("/products/upload", products),
};

const Orders = {
  list: () => requests.get<Order[]>("/orders"),
  details: (id: string) => requests.get<Order>(`/orders/${id}`),
  complete: (id: string) => requests.put<void>(`/orders/complete/${id}`, id),
  delete: (id: string) => requests.delete<void>(`/orders/${id}`),
  deleteProduct: (orderId: string, productId: string) => requests.delete<void>(`/orders/removeProduct/${orderId}/${productId}`),
  CreateOrder: (order: NewOrder) => requests.post<void>("/orders", order),
  edit: (orderProduct: OrderProductEdit) => requests.put<void>(`/orders/${orderProduct.orderId}`, orderProduct),
  listByWarehouse: (id: string, params: URLSearchParams) => axios.get<PaginatedResult<Order[]>>(`/orders/order-product/${id}`, { params })
    .then(responseBody),
  listByUsername: (params: URLSearchParams) => axios.get<PaginatedResult<Order[]>>(`/orders/user`, { params }).then(responseBody),
}

const Units = {
  unitList: () => requests.get<Unit[]>("/unit"),
  details: (id: string) => requests.get<Unit>(`/unit/${id}`),
  create: (unit: Unit) => requests.post<void>("/unit", unit),
  edit: (unit: Unit) => requests.put<void>(`/unit/${unit.id}`, unit),
  delete: (id: string) => requests.delete<void>(`/unit/${id}`),
};

const Account = {
  getCurrentUser: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  createUser: (user: NewUserFormValues) => requests.post<User>("/account/create-user", user),
  userList: () => requests.get<UserInfo[]>("/account/all-users"),
  editUser: (user: UserFormValues) => requests.post<User>("/account/edit-user", user),
  refreshToken: () => requests.post<User>("/account/refresh-token", {}),
};

const Statistic = {
  statisticsList: () => requests.get<Statistics[]>("/Statistics"),
  filterSoldProducts: (params: URLSearchParams) => axios.get<PaginatedResult<SoldProducts[]>>("/Statistics/soldProducts", { params })
    .then(responseBody),
  filterDeliveries: (params: URLSearchParams) => axios.get<PaginatedResult<DeliveredProducts[]>>("/Statistics/deliveredProducts", { params })
    .then(responseBody),
};

const Partner = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<PartnerModel[]>>("/partner", { params }).then(responseBody),
  details: (id: string) => requests.get<PartnerModel>(`/partner/${id}`),
  create: (partner: NewPartner) => requests.post<void>("/partner", partner),
  partnerOrders: (id: string, params: URLSearchParams) => axios.get<PaginatedResult<Order[]>>(`/partner/orders/${id}`, { params })
    .then(responseBody),
  partnerDeliveries: (id: string, params: URLSearchParams) => axios.get<PaginatedResult<PartnerDeliveriesProductsDto[]>>(`/partner/deliveries/${id}`, { params })
    .then(responseBody),
}

const Warehouse = {
  list: () => requests.get<WarehouseModel[]>("/warehouse"),
  details: (id: string) => requests.get<SelectedWarehouse>(`/warehouse/${id}`),
  edit: (id: string, data: WarehouseEditValues) => requests.put<WarehouseModel>(`/warehouse/${id}`, data),
  delete: (id: string) => requests.delete<void>(`/warehouse/${id}`),
  create: (data: WarehouseEditValues) => requests.post<WarehouseModel>("/warehouse", data),
};

const Suppliers = {
  list: (params: URLSearchParams) => axios.get<PaginatedResult<Supplier[]>>("/suppliers", { params }).then(responseBody),
  details: (id: string) => requests.get<Supplier>(`/suppliers/${id}`),
}

const Profiles = {
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    const formData = new FormData();
    formData.append("File", file);
    return axios.post<Photo>('photos', formData, {
      headers: { "Content-type": "multipart/form-data" }
    })
  },
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  updateProfile: (profile: Partial<Profile>) => requests.put<void>("/profiles", profile),
}

const Roles = {
  list: () => requests.get<Role[]>("/account/roles"),
  create: (role: string) => requests.post<void>("/Account/create-role", role),
}

const Categories = {
  list: () => requests.get<Category[]>("/category"),
  create: (category: string) => requests.post<void>("/categories", category),
  delete: (category: string) => requests.delete<void>(`/categories/${category}`),
}

const agent = {
  Products,
  Units,
  Account,
  Orders,
  Statistic,
  Warehouse,
  Partner,
  Suppliers,
  Profiles,
  Roles,
  Categories,
};

export default agent;
