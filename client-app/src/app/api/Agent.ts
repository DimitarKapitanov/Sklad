import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "../models/product";
import { Unit } from "../models/unit";
import { toast } from "react-toastify";
import { router } from "./router/Routes";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};
axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === "get" && Object.prototype.hasOwnProperty.call(data.errors, "id")) {
                router.navigate("/not-found");
            }
            if (data.Errors) {
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
            toast.error("unauthorized");
            break;
        case 403:
            toast.error("forbidden");
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.serverError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
});
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    // eslint-disable-next-line @typescript-eslint/ban-types
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    // eslint-disable-next-line @typescript-eslint/ban-types
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Products = {
    list: () => requests.get<Product[]>("/products"),
    filterList: () => requests.get<Product[]>(`/products/filtered/${false}`),
    details: (id: string) => requests.get<Product>(`/products/${id}`),
    create: (product: Product[]) => requests.post<void>("/products", product),
    edit: (product: Product) => requests.put<void>(`/products/${product.id}`, product),
    delete: (id: string) => requests.delete<void>(`/products/${id}`)
};

const Units = {
    unitList: () => requests.get<Unit[]>("/unit"),
    details: (id: string) => requests.get<Unit>(`/unit/${id}`),
    create: (unit: Unit) => requests.post<void>("/unit", unit),
    edit: (unit: Unit) => requests.put<void>(`/unit/${unit.id}`, unit),
    delete: (id: string) => requests.delete<void>(`/unit/${id}`)
};

const agent = {
    Products,
    Units
};

export default agent;
