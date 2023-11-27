import { Product } from "../../../app/models/product";
import { Button, Icon, Table } from "semantic-ui-react";

interface Props {
    tableHeader: string[];
    products: Product[];
    selectProduct: (id: string) => void;
    deleteProduct: (id: string) => void;
}

export default function ProductTable({ products, tableHeader, selectProduct, deleteProduct }: Props) {

    tableHeader = ["Име", "Количество", "Доставна цена", "Продажна цена", "Категория", "Мярка", "Описание", "Edit/Delete"];

    return (
        <Table celled padded selectable>
            <Table.Header>
                <Table.Row>
                    {tableHeader.map((head, i) => (
                        <Table.HeaderCell key={i}>{head}</Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {products.map(product => (
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
                                <Button color='yellow' onClick={() => selectProduct(product.id)}>
                                    <Icon name="edit" />
                                </Button>
                                <Button.Or text={'или'} />
                                <Button negative onClick={() => deleteProduct(product.id)}>
                                    <Icon name="trash" />
                                </Button>
                            </Button.Group>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}