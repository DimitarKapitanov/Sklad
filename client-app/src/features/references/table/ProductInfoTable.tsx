import { observer } from "mobx-react-lite";
import { Container, Table } from "semantic-ui-react";
import { OrderProductsDtos } from "../../../app/models/statistics";
import { useStore } from "../../../app/stores/store";

interface Props {
    order: OrderProductsDtos[];
}

export default observer(function ProductInfoTable({ order }: Props) {
    const { statisticsStore } = useStore();
    const { tableHeadersProductInfo } = statisticsStore;

    const totalPrice = () => {
        let total = 0;
        order.forEach(product => {
            total += product.price * product.quantity;
        })
        return total;
    }

    return (
        <Container fluid>
            <Table celled unstackable compact striped stackable sortable selectable structured verticalAlign="middle">
                <Table.Header fullWidth>
                    <Table.Row textAlign="center" verticalAlign="middle">
                        <Table.HeaderCell colSpan={tableHeadersProductInfo.length} className="groupe-product">
                            Информация за продадени продукти
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row textAlign="center" verticalAlign="middle">
                        {tableHeadersProductInfo.map((row) => (
                            <Table.HeaderCell key={row.key} className="groupe-product">
                                {row.label}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {order.map((currentProduct, index) => (
                        <Table.Row key={index} textAlign="center" verticalAlign="middle">
                            {tableHeadersProductInfo.map((header) => (
                                <Table.Cell key={header.key}>
                                    {header.key === 'price' || header.key === 'totalPrice'
                                        ? parseFloat((currentProduct)[header.key as keyof OrderProductsDtos].toString()).toFixed(2)
                                        : (currentProduct)[header.key as keyof OrderProductsDtos].toString()}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                    <Table.Row >
                        <Table.Cell colSpan={'5'} textAlign='right' content='Всичко без ДДС' />
                        <Table.Cell textAlign='center'>{(totalPrice()).toFixed(2)} лв.</Table.Cell>
                    </Table.Row>
                    <Table.Row >
                        <Table.Cell colSpan={'5'} textAlign='right' content='ДДС 20%' />
                        <Table.Cell textAlign='center'>{(totalPrice() * 0.2).toFixed(2)} лв.</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell colSpan={'5'} textAlign='right'>Общо с ДДС</Table.Cell>
                        <Table.Cell textAlign='center'>{(totalPrice() * 1.2).toFixed(2)} лв.</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Container>
    );
});