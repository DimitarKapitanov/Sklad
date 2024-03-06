import { SyntheticEvent, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { Product } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import ProductDetails from "../details/ProductDetails";

interface Props {
    product: Product;
}

export default function ProductTableList({ product }: Props) {
    const { productStore, modalStore } = useStore();
    const { deleteProduct, loading } = productStore;

    const [target, setTarget] = useState('');

    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteProduct(id);
    }
    return (
        <Table.Row key={product.id}>
            <Table.Cell>{product.name}</Table.Cell>
            <Table.Cell>{product.quantity}</Table.Cell>
            <Table.Cell>{product.deliveryPrice}</Table.Cell>
            <Table.Cell>{product.price}</Table.Cell>
            <Table.Cell>{product.category}</Table.Cell>
            <Table.Cell>{product.unitAcronym}</Table.Cell>
            <Table.Cell>{product.description}</Table.Cell>
            <Table.Cell>
                <Button.Group size="small" fluid icon>
                    <Button color='blue' icon='info' onClick={() => modalStore.openModal(<ProductDetails id={product.id} />, 'small')}>
                    </Button>
                    <Button negative loading={loading && target === product.id} name={product.id} onClick={(e) => handleDeleteProduct(e, product.id)}>
                        <Icon name="trash" />
                    </Button>
                </Button.Group>
            </Table.Cell>
        </Table.Row>
    )
}