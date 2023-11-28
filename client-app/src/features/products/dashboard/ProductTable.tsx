import { SyntheticEvent, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function ProductTable() {
    const { productStore } = useStore();
    const { productsByName, deleteProduct, loading } = productStore;

    const tableHeader = ["Име", "Количество", "Доставна цена", "Продажна цена", "Категория", "Мярка", "Описание", "Edit/Delete"];

    const [target, setTarget] = useState('');

    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteProduct(id);
    }


    return (
        <Table celled padded selectable className="product-table">
            <Table.Header>
                <Table.Row className="product-tale-head">
                    {tableHeader.map((row) => (
                        <Table.HeaderCell key={row} className="table-header">{row}</Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {productsByName.map((product) => (
                    <Table.Row key={product.id}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell>{product.deliveryPrice}</Table.Cell>
                        <Table.Cell>{product.price}</Table.Cell>
                        <Table.Cell>{product.category}</Table.Cell>
                        <Table.Cell>{product.unitAcronym}</Table.Cell>
                        <Table.Cell>{product.description}</Table.Cell>
                        <Table.Cell>
                            <Button.Group size="small" icon>
                                <Button color='yellow' onClick={() => productStore.selectProduct(product.id)}>
                                    <Icon name="edit" />
                                </Button>
                                <Button.Or text={'или'} />
                                <Button negative loading={loading && target === product.id} name={product.id} onClick={(e) => handleDeleteProduct(e, product.id)}>
                                    <Icon name="trash" />
                                </Button>
                            </Button.Group>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
})