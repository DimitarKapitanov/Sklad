import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Button, Header, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderPartnerDelivers } from "../../../app/common/tableHeaders/tableHeaderDeliveredProducts";
import { PagingParams } from "../../../app/models/pagination";
import { DeliveredProductDto, Partner } from "../../../app/models/partner";
import { useStore } from "../../../app/stores/store";
import OrderDetails from "../../orders/details/ProductDetails";
import PartnerDeliveryDetails from "./PartnerDeliveryDetails";
import PartnerInformation from "./PartnerInformation";
import PartnerOrderActions from "./PartnerOrderActions";


interface Props {
    partner: Partner;
}

export default observer(function ({ partner }: Props) {
    const { orderStore: { tableHeader }, modalStore: { openModals, closeModals }, partnerStore } = useStore();
    const { loadPartnerOrders, partnerOrders, partnerDelivers,
        setPagingParams, partnerOrdersPagination, dateString, clearSelectedPartner, primaryPredicate, secondaryPredicate, loadPartnerDelivers, setSecondaryPredicate } = partnerStore;

    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        if (partnerOrdersPagination) {
            setLoadingNext(true);
            setPagingParams(new PagingParams(partnerOrdersPagination.currentPage + 1));
            if (partner.isClient) loadPartnerOrders(partner.id).then(() => setLoadingNext(false));
            else if (partner.isSupplier) loadPartnerDelivers(partner.id).then(() => setLoadingNext(false));
        }
    }

    useEffect(() => {
        if (partner.isClient && !partner.isSupplier && (primaryPredicate.has('isClient') || primaryPredicate.has('all'))) loadPartnerOrders(partner.id);
        else if (partner.isSupplier && !partner.isClient && (primaryPredicate.has('isSupplier') || primaryPredicate.has('all'))) loadPartnerDelivers(partner.id);
        else {
            if (primaryPredicate.has('isClient')) {
                loadPartnerDelivers(partner.id);
            } else if (primaryPredicate.has('isSupplier')) {
                loadPartnerOrders(partner.id);
            } else {
                setSecondaryPredicate('allOrders', 'true')
                loadPartnerOrders(partner.id);
                loadPartnerDelivers(partner.id);
            }
        }
    }, [partner.id, loadPartnerOrders, loadPartnerDelivers, partner.isClient, partner.isSupplier, setSecondaryPredicate, primaryPredicate]);


    const totalPrice = (products: DeliveredProductDto[]) => {
        return products.reduce((acc: number, product: DeliveredProductDto) => acc + (product.quantity * product.price), 0);
    }
    const [header, setHeader] = useState<string>('');

    useEffect(() => {
        if (partner.isClient && !partner.isSupplier) {
            setHeader(`Поръчки на партньор ${partner.name}`);
        } else if (partner.isSupplier && !partner.isClient) {
            setHeader(`Доставки на партньор ${partner.name}`);
        } else {
            setHeader(`Информация за партньор ${partner.name}`);
        }
    }, [partner]);

    return (
        <>
            <Header as='h2' content={`Информация за партньор ${partner.name}`} style={{ marginTop: 40 }} />
            <PartnerInformation partner={partner} />
            <PartnerOrderActions />
            <Header as='h2' content={header} />
            {partner.isClient && (
                <InfiniteScroll
                    className="horizontal-gradient"
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && !!partnerOrdersPagination && partnerOrdersPagination.currentPage < partnerOrdersPagination.totalPages}
                    initialLoad={false}
                    useWindow={false}
                    style={{ overflowX: 'auto' }}
                >
                    <DataTable header={tableHeader}>
                        {partnerOrders.map((order, index) => (
                            <Table.Row key={index} >
                                <Table.Cell>{order.partnerName}</Table.Cell>
                                <Table.Cell>{order.warehouseName}</Table.Cell>
                                <Table.Cell>{dateString(order.isCompleted ? order.completedDate : order.orderCreated)}</Table.Cell>
                                <Table.Cell>{order.isCompleted ? "Завършена" : "В процес"}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button color='blue'
                                        onClick={() => openModals('partnerOrdersDetailsModal', <OrderDetails orderId={order.id} />, 'large')}
                                        size="tiny" icon='info' />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </DataTable>
                    <div className="close-button">
                        <Button
                            style={{ backgroundColor: '#EFD780' }}
                            onClick={() => { closeModals('partnerDetailsModal'); clearSelectedPartner(); }}
                            size="tiny" content="Затвори" />
                    </div>
                </InfiniteScroll>
            )}
            {partner.isSupplier && secondaryPredicate.has('allOrders') && (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && !!partnerOrdersPagination && partnerOrdersPagination.currentPage < partnerOrdersPagination.totalPages}
                    initialLoad={false}
                    useWindow={false}
                    style={{ overflowX: 'auto' }}
                >
                    <DataTable header={tableHeaderPartnerDelivers}>
                        {partnerDelivers.map((deliver, index) => (
                            <Table.Row key={index} >
                                <Table.Cell>{deliver.partnerName}</Table.Cell>
                                <Table.Cell>{dateString(deliver.createdOn)}</Table.Cell>
                                <Table.Cell>{deliver.contactPersonName}</Table.Cell>
                                <Table.Cell>{`${deliver.deliveryProductDtos.length} бр.`}</Table.Cell>
                                <Table.Cell>{`${totalPrice(deliver.deliveryProductDtos)} лв.`}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button color='blue'
                                        onClick={() =>
                                            openModals('partnerDeliveryDetailsModal',
                                                <PartnerDeliveryDetails delivery={deliver.deliveryProductDtos} partner={partner} />, 'large')
                                        }
                                        size="tiny" icon='info' />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </DataTable >
                    <div className="close-button">
                        <Button
                            style={{ backgroundColor: '#EFD780' }}
                            onClick={() => { closeModals('partnerDetailsModal'); clearSelectedPartner(); }}
                            size="tiny" content="Затвори" />
                    </div>
                </InfiniteScroll >
            )}
        </>
    );
})