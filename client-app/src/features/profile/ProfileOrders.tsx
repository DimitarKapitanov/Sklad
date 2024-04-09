import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { Button, Header, Pagination, PaginationProps, Segment, Table } from "semantic-ui-react"
import LoadingComponent from "../../app/layout/LoadingComponent"
import { PagingParams } from "../../app/models/pagination"
import { useStore } from "../../app/stores/store"
import ProductDetails from "../orders/details/ProductDetails"

interface Props {
    displayName: string
}

export default observer(function ProfileOrders({ displayName }: Props) {
    const { orderStore, modalStore: { openModals }, commonStore: { dateString } } = useStore();
    const { pagedOrderRegistry, loadOrdersByUsername, setPredicate, loadingDetails, getOrderByUser, setPagingParams, pagination, setLastUsername } = orderStore;

    function handlePageChange(_: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) {
        const activePage = data.activePage as number;
        setPagingParams(new PagingParams(activePage));
        loadOrdersByUsername(displayName);
    }

    useEffect(() => {
        setLastUsername(displayName);
    }, [displayName, setLastUsername]);

    useEffect(() => {
        if (displayName) {
            loadOrdersByUsername(displayName);
        }
    }, [loadOrdersByUsername, pagedOrderRegistry, displayName, setPredicate]);

    if (loadingDetails) return (<LoadingComponent content="Зареждане на поръчките..." />)

    return (
        <Segment className="profile-order">
            {getOrderByUser && getOrderByUser.length > 0 ? (
                <Table celled unstackable >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Дата на създаване</Table.HeaderCell>
                            <Table.HeaderCell>Адрес</Table.HeaderCell>
                            <Table.HeaderCell>Дата на приключване</Table.HeaderCell>
                            <Table.HeaderCell>Действия</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {pagination && getOrderByUser.map((order, index) => {
                            const rowNumber = (pagination?.currentPage - 1) * (pagination?.itemsPerPage) + index + 1;
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell>{rowNumber}</Table.Cell>
                                    <Table.Cell>{dateString(order.orderCreated)}</Table.Cell>
                                    <Table.Cell>{order.address}</Table.Cell>
                                    <Table.Cell>{(order.isCompleted && order.completedDate) ? dateString(order.completedDate) : "В процес"}</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            content="Преглед"
                                            color="blue"
                                            onClick={() =>
                                                openModals('userOrderDetails', <ProductDetails orderId={order.id} modalName="userOrderDetails" />, "large")}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                    {pagination && (
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell colSpan="5">
                                    <Pagination
                                        defaultActivePage={1}
                                        activePage={pagination.currentPage || 1}
                                        onPageChange={handlePageChange}
                                        totalPages={pagination.totalPages || 1}
                                    />
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    )}
                </Table>
            ) : (
                <Header style={{ color: 'red', fontSize: '20px' }}>Потребителят {displayName} няма завършени поръчки!</Header>
            )}
        </Segment>
    )
})