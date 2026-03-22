import { observer } from "mobx-react-lite";
import { Button, Table } from "semantic-ui-react";
import RevealButton from "../../../app/common/buttons/RevealButton";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderProductCreate } from "../../../app/common/tableHeaders/tableHeaderProduct";
import { Product } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import ProductCreate from "./ProductCreate";

interface Props {
    products: Product[];
    deliveryCompany: string;
    setFieldValue: (field: string, value: Product[], shouldValidate?: boolean) => void;
}

export default observer(function ProductTable({ products, deliveryCompany, setFieldValue }: Props) {
    const { supplierStore, modalStore } = useStore();
    const { supplierOptions } = supplierStore;
    const company = supplierOptions.find((x) => x.key === deliveryCompany);

    function handleRemoveProduct(id: string) {
        const newProducts = products.filter((x) => x.id !== id);
        setFieldValue("products", newProducts);
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
                <h1>{company?.text}</h1>
                <RevealButton
                    visibleContent="Добави продукт"
                    hiddenContent="Добави"
                    onClick={(e) => {
                        e?.preventDefault();
                        modalStore.openModal(
                            <ProductCreate setFieldValue={setFieldValue} products={products} />, "mini"
                        );
                    }}
                />
            </div>
            <DataTable header={tableHeaderProductCreate}>
                {products && products.map((product, index: number) => (
                    <Table.Row key={product.id}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell content={product.name} />
                        <Table.Cell content={product.categoryName} />
                        <Table.Cell content={product.quantity} />
                        <Table.Cell content={product.unitAcronym} />
                        <Table.Cell content={product.deliveryPrice} />
                        <Table.Cell content={product.price} />
                        <Table.Cell content={product.description} />
                        <Table.Cell>
                            <Button
                                floated="left"
                                icon="trash"
                                color="red"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveProduct(product.id);
                                }}
                            />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </DataTable>
        </div >
    )
});