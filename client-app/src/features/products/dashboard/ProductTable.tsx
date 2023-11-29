import { SyntheticEvent, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function ProductTable() {
    const { productStore } = useStore();
    const { productsSort, deleteProduct, loading, tableHeader } = productStore;

    const [target, setTarget] = useState('');
    const [products, setProducts] = useState(productsSort);
    const [order, setOrder] = useState('asc');

    function sortProd(keySort: string, order: string) {
        if (order === 'asc') {
            setProducts([...productsSort].sort((a, b) => (a[keySort] > b[keySort]) ? 1 : -1));
            setOrder('desc');
        } else {
            setProducts([...productsSort].sort((a, b) => (a[keySort] < b[keySort]) ? 1 : -1));
            setOrder('asc');
        }
    }
    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteProduct(id);
    }


    return (
        <Table celled padded selectable className="product-table">
            <Table.Header>
                <Table.Row className="product-tale-head">
                    {tableHeader.map((row) => (
                        <Table.HeaderCell key={row.key} className="table-header" onClick={() => sortProd(row.key, order)}>{row.label}
                            <Icon name="angle down" className={`${row.key ===  && order === 'desc' ? 'sort-button sort-reverse' : 'sort-button'}`} />
                        </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {products.map((product) => (
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

function useEffect(arg0: () => void, arg1: import("../../../app/models/product").Product[][]) {
    throw new Error("Function not implemented.");
}
