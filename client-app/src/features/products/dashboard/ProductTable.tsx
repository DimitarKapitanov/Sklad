import { Fragment, useEffect, useState } from "react";
import { Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Product } from "../../../app/models/product";
import ProductTableList from "./ProductTableList";

export default observer(function ProductTable() {
    const { productStore } = useStore();
    const { tableHeader, groupedProducts, sortProducts, latestProducts } = productStore;
    const [showLatest, setShowLatest] = useState(false);
    
    useEffect(() => {
        if (window.location.pathname === "/latest") {
            setShowLatest(true);
        } else {
            setShowLatest(false);
        }
    }, []);

    return (
        <>
            <Table compact celled sortable selectable className="product-table">
                <Table.Header>
                    <Table.Row className="product-tale-head groupe-product">
                        {tableHeader.map((row) => (
                            <Table.HeaderCell
                                key={row.key}
                                onClick={() => sortProducts(row.key)}
                                className="groupe-product"
                            >
                                {row.label}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                {groupedProducts.map(([group, products]) => (
                    <Fragment key={group}>
                        <Table.Header >
                            <Table.Row>
                                <Table.HeaderCell colSpan="8" className="groupe-product">
                                    {group.toLocaleUpperCase()}
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {(showLatest ? latestProducts : products).map((product: Product) => (
                                <ProductTableList
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </Table.Body>
                    </Fragment>
                ))}
            </Table >
        </>
    )
})
