import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button, Card, Container, Header, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { productTableHeader } from "../../../app/common/tableHeaders/tableHeaderProduct";
import { OrderProductsDtos } from "../../../app/models/statistics";
import { useStore } from "../../../app/stores/store";
import PartnerInformation from "../../partners/details/PartnerInformation";

interface Props {
    products: OrderProductsDtos[];
    partnerId: string;
}

export default observer(function DeliveredProductDetails({ products, partnerId }: Props) {
    const { modalStore: { closeModal }, statisticsStore: { loadSupplierInfo, supplierInfo } } = useStore();

    useEffect(() => {
        if (partnerId) loadSupplierInfo(partnerId);
    }, [partnerId, loadSupplierInfo]);

    const totalPrice = () => {
        let total = 0;
        products.forEach(product => {
            total += product.price * product.quantity;
        })
        return total;
    }

    return (
        <Container style={{ marginTop: '40px', paddingBottom: '2em' }}>
            <Header as="h2" content={`Доставка`} />
            {supplierInfo && <PartnerInformation />}
            <Card fluid>
                <Card.Content style={{ overflowX: 'auto' }}>
                    <Header as="h2" content={`Доставени продукти`} />
                    <DataTable header={productTableHeader}>
                        {products.map((product, index) => (
                            <Table.Row key={index} >
                                <Table.Cell>{product.name}</Table.Cell>
                                <Table.Cell>{product.category}</Table.Cell>
                                <Table.Cell>{product.unitAcronym}</Table.Cell>
                                <Table.Cell>{product.quantity}</Table.Cell>
                                <Table.Cell>{product.price.toFixed(2)} лв.</Table.Cell>
                                <Table.Cell>{(product.quantity * product.price).toFixed(2)} лв.</Table.Cell>
                                <Table.Cell textAlign='center' content={`${((product.quantity * product.price) * 0.2).toFixed(2)} лв.`} />
                                <Table.Cell textAlign='center'>{((product.quantity * product.price) * 1.2).toFixed(2)} лв.</Table.Cell>
                            </Table.Row>
                        ))}
                        <Table.Row >
                            <Table.Cell colSpan={'7'} textAlign='right' content='Всичко без ДДС' />
                            <Table.Cell textAlign='center'>{(totalPrice()).toFixed(2)} лв.</Table.Cell>
                        </Table.Row>
                        <Table.Row >
                            <Table.Cell colSpan={'7'} textAlign='right' content='ДДС 20%' />
                            <Table.Cell textAlign='center'>{(totalPrice() * 0.2).toFixed(2)} лв.</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell colSpan={'7'} textAlign='right'>Общо с ДДС</Table.Cell>
                            <Table.Cell textAlign='center'>{(totalPrice() * 1.2).toFixed(2)} лв.</Table.Cell>
                        </Table.Row>
                    </DataTable>
                </Card.Content>
                <Card.Content extra textAlign="right">
                    <Button
                        onClick={() => closeModal()}
                        content="Затвори"
                    />
                </Card.Content>
            </Card>
        </Container>
    )
})