import { SyntheticEvent, useReducer, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Product } from "../../../app/models/product";
import exampleReducer from "../../../app/stores/sort"


export default observer(function ProductTable() {
    const { productStore } = useStore();
    const { productsSort, deleteProduct, loading, tableHeader } = productStore;

    const [target, setTarget] = useState('');
    const [state, dispatch] = useReducer(exampleReducer, {
        column: null,
        data: productsSort,
        direction: null,
    })
    const { column, data, direction } = state

    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteProduct(id);
    }

    return (
        <Table celled padded selectable className="product-table">
            <Table.Header>
                <Table.Row className="product-tale-head">
                    {tableHeader.map((row) => (
                        <Table.HeaderCell
                            key={row.key}
                            className="table-header sort-button"
                            sorted={column === 'name' ? direction : null}
                            onClick={() => dispatch({ type: 'CHANGE_SORT', column: `${row.key}` })}
                        >
                            {row.label}
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data.map((product: Product) => (
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
