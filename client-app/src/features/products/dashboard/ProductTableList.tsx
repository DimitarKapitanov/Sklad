import { SyntheticEvent, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Product } from "../../../app/models/product";
import { Link } from "react-router-dom";

interface Props {
    product: Product;
}

export default function ProductTableList({ product }: Props) {
    const { productStore } = useStore();
    const { deleteProduct, loading } = productStore;

    const [target, setTarget] = useState('');
    console.log(typeof product.deliveryPrice);
    
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
            <Table.Cell>{product.unitAcronym}</Table.Cell>
            <Table.Cell>{product.description}</Table.Cell>
            <Table.Cell>
                <Button.Group size="small" icon>
                    <Button color='yellow' as={Link} to={`/products/${product.id}`}>
                        <Icon name="edit" />
                    </Button>
                    <Button.Or text={'или'} />
                    <Button negative loading={loading && target === product.id} name={product.id} onClick={(e) => handleDeleteProduct(e, product.id)}>
                        <Icon name="trash" />
                    </Button>
                </Button.Group>
            </Table.Cell>
        </Table.Row>
    )
}