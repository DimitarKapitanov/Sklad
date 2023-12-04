import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../../layout/App";
import ProductDashboard from "../../../features/products/dashboard/ProductDashboard";
import ProductForm from "../../../features/products/form/ProductForm";
import ProductDetails from "../../../features/products/details/ProductDetails";
import UpdateProductForm from "../../../features/products/form/UpdateProductForm";
import UnitForm from "../../../features/units/form/UnitForm";

export const routes: RouteObject[] =[
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'products', element: <ProductDashboard key={'all'} />},
            {path: 'latest', element: <ProductDashboard key={'latest'}/>},
            {path: 'products/:id', element: <ProductDetails />},
            {path: 'createProduct', element: <ProductForm key={'create'}/>},
            {path: 'manage/:id', element: <UpdateProductForm />},
            {path: 'createUnit', element: <UnitForm />}
        ]
    },
]

export const router = createBrowserRouter(routes);