import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Confirm, Header, Table } from "semantic-ui-react";
import DeleteAnimation from "../../../app/common/animations/DeletingAnimation";
import { Order } from "../../../app/models/order";
import { useStore } from "../../../app/stores/store";
interface Props {
    order: Order;
    deleteOrder: (id: string) => void;
}

export default observer(function ProductTableList({ order, deleteOrder }: Props) {
    const { commonStore: { dateString }, userStore: { user } } = useStore();

    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)

    return (
        <>
            <Table.Row key={order.id}>
                <Table.Cell>{order.partnerName}</Table.Cell>
                <Table.Cell>{order.warehouseName}</Table.Cell>
                <Table.Cell>{dateString(order.isCompleted ? order.completedDate : order.orderCreated)}</Table.Cell>
                <Table.Cell>{order.isCompleted ? "Завършена" : "Незавършена"}</Table.Cell>
                <Table.Cell textAlign='center'>
                    <Button color="blue" icon="info" as={Link} to={`/orders/${order.id}`} />
                    <Button color="red" icon="trash" onClick={() => setDeleteConfirmShow(true)} disabled={user?.role.includes("Employee")} />
                </Table.Cell>
            </Table.Row>
            <Confirm
                className="animated-modal"
                size="mini"
                style={{ backgroundColor: 'cadetblue' }}
                open={deleteConfirmShow}
                onConfirm={() => {
                    deleteOrder(order.id);
                    setDeleteConfirmShow(false);
                }}
                onCancel={() => setDeleteConfirmShow(false)}
                content={
                    <div className="delete-container">
                        <Header className="delete-header" content={"Сигурни ли сте, че искате да изтриете тази поръчка?"} />
                        <DeleteAnimation />
                    </div>
                }
                confirmButton="Изтрий"
                cancelButton="Отказ"
            />
        </>
    )
})