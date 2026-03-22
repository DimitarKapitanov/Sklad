import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button, Container, Header, Segment, Table } from "semantic-ui-react";
import DataTable from "../../../app/common/table/DataTable";
import { tableHeaderPartnerDelivers } from "../../../app/common/tableHeaders/tableHeaderDeliveredProducts";
import { PagingParams } from "../../../app/models/pagination";
import { DeliveredProductDto } from "../../../app/models/partner";
import { useStore } from "../../../app/stores/store";
import ProductDetails from "../../orders/details/ProductDetails";
import PartnerDeliveryDetails from "./PartnerDeliveryDetails";
import PartnerInformation from "./PartnerInformation";
import PartnerOrderActions from "./PartnerOrderActions";

export default observer(function () {
    const { orderStore: { tableHeader }, modalStore: { openModals }, partnerStore } = useStore();

    const { loadPartnerOrders, partnerOrders, partnerDelivers,
        setPagingParams, partnerOrdersPagination, dateString, clearSelectedPartner, loadPartner,
        primaryPredicate, secondaryPredicate, loadPartnerDelivers, setSecondaryPredicate, selectedPartner } = partnerStore;

    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        if (partnerOrdersPagination && selectedPartner) {
            setLoadingNext(true);
            setPagingParams(new PagingParams(partnerOrdersPagination.currentPage + 1));
            if (selectedPartner.isClient) loadPartnerOrders(selectedPartner.id).then(() => setLoadingNext(false));
            else if (selectedPartner.isSupplier) loadPartnerDelivers(selectedPartner.id).then(() => setLoadingNext(false));
        }
    }

    const { id } = useParams();
    const location = useLocation();

    // ...

    useEffect(() => {
        if (location.pathname === '/partners') {
            clearSelectedPartner();
        }
    }, [location, clearSelectedPartner]);

    useEffect(() => {
        if (!selectedPartner && id) loadPartner(id);
    }, [id, loadPartner, selectedPartner]);

    useEffect(() => {
        if (selectedPartner && selectedPartner.isClient && !selectedPartner.isSupplier && (primaryPredicate.has('isClient') || primaryPredicate.has('all'))) loadPartnerOrders(selectedPartner.id);
        else if (selectedPartner && selectedPartner.isSupplier && !selectedPartner.isClient && (primaryPredicate.has('isSupplier') || primaryPredicate.has('all'))) loadPartnerDelivers(selectedPartner.id);
        else {
            if (selectedPartner) {
                if (primaryPredicate.has('isClient')) {
                    loadPartnerOrders(selectedPartner.id);
                } else if (primaryPredicate.has('isSupplier')) {
                    loadPartnerDelivers(selectedPartner.id);
                } else {
                    setSecondaryPredicate('allOrders', 'true');
                }
            }
        }
    }, [selectedPartner, loadPartnerOrders, loadPartnerDelivers, setSecondaryPredicate, primaryPredicate]);

    const totalPrice = (products: DeliveredProductDto[]) => {
        return products.reduce((acc: number, product: DeliveredProductDto) => acc + (product.quantity * product.price), 0);
    }

    const [header, setHeader] = useState<string>('');

    useEffect(() => {
        if (selectedPartner) {
            if (selectedPartner.isClient && !selectedPartner.isSupplier) {
                setHeader(`Поръчки на партньор ${selectedPartner.name}`);
            } else if (selectedPartner.isSupplier && !selectedPartner.isClient) {
                setHeader(`Доставки на партньор ${selectedPartner.name}`);
            } else {
                setHeader(`Информация за партньор ${selectedPartner.name}`);
            }
        }
    }, [selectedPartner]);

    return (
        <Segment>
            {selectedPartner && (
                <Container >
                    <Header as='h2' content={`Информация за партньор ${selectedPartner.name}`} style={{ marginTop: 40 }} />
                    <PartnerInformation />
                    <PartnerOrderActions />
                    <Header as='h2' content={header} />
                    {selectedPartner && selectedPartner.isClient && (
                        <InfiniteScroll
                            className="horizontal-gradient"
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!partnerOrdersPagination && partnerOrdersPagination.currentPage < partnerOrdersPagination.totalPages}
                            initialLoad={false}
                            useWindow={false}
                            style={{ overflowX: 'auto' }}
                        >
                            <Header as='h2' content={`Поръчки`} />
                            <DataTable header={tableHeader}>
                                {partnerOrders.map((order, index) => (
                                    <Table.Row key={index} >
                                        <Table.Cell>{order.partnerName}</Table.Cell>
                                        <Table.Cell>{order.warehouseName}</Table.Cell>
                                        <Table.Cell>{dateString(order.isCompleted ? order.completedDate : order.orderCreated)}</Table.Cell>
                                        <Table.Cell>{order.isCompleted ? "Завършена" : "В процес"}</Table.Cell>
                                        <Table.Cell textAlign="center">
                                            <Button color='blue'
                                                onClick={() => openModals('partnerOrdersDetailsModal', <ProductDetails orderId={order.id} />, 'large')}
                                                size="tiny" icon='info' />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </DataTable>
                        </InfiniteScroll>
                    )}
                    {selectedPartner.isSupplier && secondaryPredicate.has('allOrders') && (
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!partnerOrdersPagination && partnerOrdersPagination.currentPage < partnerOrdersPagination.totalPages}
                            initialLoad={false}
                            useWindow={false}
                            style={{ overflowX: 'auto' }}
                        >
                            <Header as='h2' content={`Доставки`} style={{ marginTop: "20px" }} />
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
                                                        <PartnerDeliveryDetails delivery={deliver.deliveryProductDtos} partner={selectedPartner} />, 'large')
                                                }
                                                size="tiny" icon='info' />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </DataTable >
                        </InfiniteScroll >
                    )}
                    <div className="close-button">
                        <Button
                            style={{ backgroundColor: '#EFD780' }}
                            onClick={() => clearSelectedPartner()}
                            as={Link} to={`/partners`} content="Назад" />
                    </div>
                </Container>
            )}
        </Segment>
    );
})