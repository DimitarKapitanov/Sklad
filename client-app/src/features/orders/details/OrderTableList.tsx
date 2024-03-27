import { observer } from "mobx-react-lite";
import { Button, Icon, Table } from "semantic-ui-react";
import { Order } from "../../../app/models/order";
import { useStore } from "../../../app/stores/store";
import OrderProductEdit from "../form/OrderProductEdit";

interface Props {
    order: Order;
    isEditClicked: boolean;
}
export default observer(function OrderTableList({ order, isEditClicked }: Props) {
    const { modalStore, orderStore } = useStore();
    const { productTableHeader, sortOrderProducts, sortedOrderProducts, sortCategory, sortDirection, deleteProduct } = orderStore;

    const totalPrice = () => {
        let total = 0;
        order?.orderProductDtos.forEach(product => {
            total += product.price * product.quantity;
        })
        return total;
    }

    return (
        <Table compact size="small" unstackable celled sortable selectable className="product-table">
            <Table.Header>
                <Table.Row>
                    {
                        productTableHeader.map((header, index) => (
                            <Table.HeaderCell
                                textAlign='center'
                                key={index}
                                onClick={() => sortOrderProducts(header.key)}
                                className="groupe-product"
                            >
                                {header.label}
                                {sortCategory === header.key && (
                                    sortDirection === 'asc' ?
                                        <Icon name="angle up"></Icon> :
                                        <Icon name="angle down"></Icon>
                                )}
                            </Table.HeaderCell>
                        ))
                    }
                    {isEditClicked && <Table.HeaderCell style={{ backgroundColor: '#f0f8ff' }} textAlign='center'>Действия</Table.HeaderCell>}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedOrderProducts.map((product) => (
                    <Table.Row key={product.id}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.category}</Table.Cell>
                        <Table.Cell>{product.unitAcronym}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell>{product.price.toFixed(2)} лв.</Table.Cell>
                        <Table.Cell>{(product.quantity * product.price).toFixed(2)} лв.</Table.Cell>
                        <Table.Cell textAlign='center' content='20%' />
                        <Table.Cell textAlign='center'>{((product.quantity * product.price) * 1.2).toFixed(2)} лв.</Table.Cell>
                        {isEditClicked &&
                            <Table.Cell textAlign="center">
                                <Button size="mini"
                                    onClick={() => modalStore.openModal(<OrderProductEdit orderProduct={product} />, 'mini')} icon='pencil' color="yellow" />
                                <Button size="mini" icon='trash' color="red" onClick={() => deleteProduct(product.orderId, product.productId)} />
                            </Table.Cell>
                        }
                    </Table.Row>
                ))}
                <Table.Row >
                    <Table.Cell colSpan={isEditClicked ? "8" : '7'} textAlign='right' content='Всичко без ДДС' />
                    <Table.Cell textAlign='center'>{(totalPrice()).toFixed(2)} лв.</Table.Cell>
                </Table.Row>
                <Table.Row >
                    <Table.Cell colSpan={isEditClicked ? "8" : '7'} textAlign='right' content='ДДС 20%' />
                    <Table.Cell textAlign='center'>{(totalPrice() * 0.2).toFixed(2)} лв.</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell colSpan={isEditClicked ? "8" : '7'} textAlign='right'>Общо с ДДС</Table.Cell>
                    <Table.Cell textAlign='center'>{(totalPrice() * 1.2).toFixed(2)} лв.</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    )
})