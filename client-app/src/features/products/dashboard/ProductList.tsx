import React from "react";
import { Product } from "../../../app/models/product";

interface Props {
    products: Product[];
}

export default function ProductList({ products }: Props) {

    return (
        <div>
            <h1>Product Dashboard</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    )
}