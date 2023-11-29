import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../../layout/App";
import ProductDashboard from "../../../features/products/dashboard/ProductDashboard";
import ProductForm from "../../../features/products/form/ProductForm";
import ProductDetails from "../../../features/products/details/ProductDetails";

export const routes: RouteObject[] =[
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'products', element: <ProductDashboard />},
            {path: 'products/:id', element: <ProductDetails />},
            {path: 'createProduct', element: <ProductForm key={'create'}/>},
            {path: 'manage/:id', element: <ProductForm key={'manage'} />},
        ]
    },
]

export const router = createBrowserRouter(routes);