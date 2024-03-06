import { observer } from 'mobx-react-lite';
import { Button, Pagination, PaginationProps, Segment, Table } from 'semantic-ui-react';
import DataTable from '../../../app/common/table/DataTable';
import { tableHeaderPartnerDelivers } from '../../../app/common/tableHeaders/tableHeaderDeliveredProducts';
import { PagingParams } from '../../../app/models/pagination';
import { DeliveredProducts, OrderProductsDtos } from '../../../app/models/statistics';
import { useStore } from '../../../app/stores/store';
import DeliveredProductActions from './DeliveredProductActions';
import DeliveredProductsDetails from './DeliveredProductsDetails';

interface Props {
    deliveries: DeliveredProducts[] | undefined;
    id: string;
}

export default observer(function DeliveredProductsTable({ deliveries, id }: Props) {
    const { commonStore: { dateString }, statisticsStore, modalStore } = useStore();
    const { setPagingParams, pagination, loadingDeliveredProducts } = statisticsStore;

    const totalPrice = (deliveryProductDtos: OrderProductsDtos[]) => {
        return deliveryProductDtos.reduce((acc: number, product: OrderProductsDtos) => acc + (product.quantity * product.price), 0);
    }

    function handlePageChange(
        _: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: PaginationProps) {
        const activePage = data.activePage as number;
        setPagingParams(new PagingParams(activePage));
        loadingDeliveredProducts(id);
    }

    return (
        <Segment>
            <DeliveredProductActions />
            {deliveries && deliveries.length > 0 ? (
                <DataTable header={tableHeaderPartnerDelivers}>
                    {deliveries.map((supplier, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{supplier.partnerName}</Table.Cell>
                            <Table.Cell>{dateString(supplier.createdOn)}</Table.Cell>
                            <Table.Cell>{supplier.contactPersonName}</Table.Cell>
                            <Table.Cell>{`${supplier.deliveredProducts.length} бр.`}</Table.Cell>
                            <Table.Cell>{`${totalPrice(supplier.deliveredProducts)} лв.`}</Table.Cell>
                            <Table.Cell><Button color='blue' size="tiny" icon='info' onClick={() => modalStore.openModal(<DeliveredProductsDetails partnerId={supplier.partnerId} products={supplier.deliveredProducts} />, "large")} /></Table.Cell>
                        </Table.Row>
                    ))}
                </DataTable>
            ) : (
                <p style={{ color: 'red', fontSize: '20px' }}>Няма намерени доставки.</p>
            )
            }
            {pagination && pagination.totalPages > 1 && (
                <Pagination
                    defaultActivePage={1}
                    activePage={pagination.currentPage || 1}
                    onPageChange={handlePageChange}
                    totalPages={pagination.totalPages || 1}
                />
            )}
        </Segment >
    )
});