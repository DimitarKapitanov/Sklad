import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Confirm, Header, Table } from "semantic-ui-react";
import DeleteAnimation from "../../../app/common/animations/DeletingAnimation";
import { Product } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import ProductDetails from "../details/ProductDetails";

interface Props {
    product: Product;
}

export default observer(function ProductTableList({ product }: Props) {
    const { productStore, modalStore } = useStore();
    const { deleteProduct, loading } = productStore;

    const [target, setTarget] = useState('');
    const [deleteConfirmShow, setDeleteConfirmShow] = useState(false)

    function handleDeleteProduct(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteProduct(id);
    }
    return (
        <>
            <Table.Row key={product.id}>
                <Table.Cell collapsing>{product.name}</Table.Cell>
                <Table.Cell collapsing>{product.quantity}</Table.Cell>
                <Table.Cell collapsing>{parseFloat(product.deliveryPrice).toFixed(2)}</Table.Cell>
                <Table.Cell collapsing>{parseFloat(product.price).toFixed(2)}</Table.Cell>
                <Table.Cell collapsing>{product.category}</Table.Cell>
                <Table.Cell collapsing>{product.unitAcronym}</Table.Cell>
                <Table.Cell>{product.description}</Table.Cell>
                <Table.Cell collapsing>
                    <Button
                        color='blue'
                        icon='info'
                        onClick={() => modalStore.openModal(<ProductDetails id={product.id} />, 'small')}
                    />
                    <Button
                        negative
                        icon="trash"
                        loading={loading && target === product.id}
                        name={product.id}
                        onClick={() => setDeleteConfirmShow(true)}
                    />
                </Table.Cell>
            </Table.Row>
            <Confirm
                size="mini"
                className="animated-modal"
                style={{ backgroundColor: 'cadetblue' }}
                open={deleteConfirmShow}
                onConfirm={(e) => {
                    handleDeleteProduct(e, product.id)
                    setDeleteConfirmShow(false);
                }}
                onCancel={() => setDeleteConfirmShow(false)}
                content={
                    <div className="delete-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", padding: 20 }}>
                        <Header className="delete-header">"Сигурни ли сте, че искате да изтриете този продукт ?"</Header>
                        <DeleteAnimation />
                    </div>
                }
                cancelButton="Отказ"
                confirmButton="Изтрий"

            />
        </>
    )
})