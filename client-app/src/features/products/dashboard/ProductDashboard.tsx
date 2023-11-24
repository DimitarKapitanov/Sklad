import React from "react";
import { Button, Grid, Icon, Table } from "semantic-ui-react";
import { Product } from "../../../app/models/product";

interface Props {
    products: Product[];
}

export default function ProductDashboard({ products }: Props) {

    return (
        <Grid style={{ marginLeft: '20px' }} >
            <Grid.Column width="11">
                <Table celled padded selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Quantity</Table.HeaderCell>
                            <Table.HeaderCell>Delivery price</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Category</Table.HeaderCell>
                            <Table.HeaderCell>Unit name</Table.HeaderCell>
                            <Table.HeaderCell>Unit acronym</Table.HeaderCell>
                            <Table.HeaderCell>Unit type</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
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
                                <Table.Cell>{product.unit.name}</Table.Cell>
                                <Table.Cell>{product.unit.acronym}</Table.Cell>
                                <Table.Cell>{product.unit.type}</Table.Cell>
                                <Table.Cell>{product.description}</Table.Cell>
                                <Table.Cell>
                                    <Button.Group size="small" icon>
                                        <Button color='yellow'>
                                            <Icon name="edit" />
                                        </Button>
                                        <Button.Or />
                                        <Button negative>
                                            <Icon name="trash" />
                                        </Button>
                                    </Button.Group>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Grid.Column>
        </Grid>

    )
}