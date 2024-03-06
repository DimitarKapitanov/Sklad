import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Confirm, Table } from "semantic-ui-react";
import { Order } from "../../../app/models/order";

interface Props {
    order: Order;
    deleteOrder: (id: string) => void;
}
// TODO: fix order state isCompleted and completedDate
export default observer(function ProductTableList({ order, deleteOrder }: Props) {
    const getDateString = (date: Date | null) => {
        if (date === null) return "";
        const dateToString = new Date(date);
        return dateToString.toLocaleString('bg-BG', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(',', '');
    }

    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)

    return (
        <>
            <Table.Row key={order.id}>
                <Table.Cell>{order.partnerName}</Table.Cell>
                <Table.Cell>{order.warehouseName}</Table.Cell>
                <Table.Cell>{getDateString(order.isCompleted ? order.completedDate : order.orderCreated)}</Table.Cell>
                <Table.Cell>{order.isCompleted ? "Завършена" : "Незавършена"}</Table.Cell>
                <Table.Cell textAlign='center'>
                    <Button color="blue" icon="info" as={Link} to={`/orders/${order.id}`} />
                    <Button color="red" icon="trash" onClick={() => setDeleteConfirmShow(true)} />
                </Table.Cell>
            </Table.Row>
            <Confirm
                open={deleteConfirmShow}
                onConfirm={() => {
                    deleteOrder(order.id);
                    setDeleteConfirmShow(false);
                }}
                onCancel={() => setDeleteConfirmShow(false)}
                content="Сигурни ли сте, че искате да изтриете поръчката ?"
                confirmButton="Изтрий"
                cancelButton="Отказ"
            />
        </>
    )
})