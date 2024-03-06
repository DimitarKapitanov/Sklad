import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button, ButtonGroup, Card, Container, Header } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import UpdateProductForm from "../form/UpdateProductForm";

interface Props {
    id: string;
}
export default observer(function ProductDetails({ id }: Props) {

    const { productStore, modalStore } = useStore();
    const { selectedProduct: product, loadProduct, loadingInitial } = productStore;
    // const { id } = useParams();

    useEffect(() => {
        if (id) loadProduct(id);
        window.scrollTo(0, 0);
    }, [id, loadProduct]);

    if (loadingInitial || !product) return <LoadingComponent />;

    return (
        <Container >
            <Header as={'h2'} content="Детайли за продукт" />
            <Card fluid >
                <Card.Content>
                    <Card.Header>{product.name}</Card.Header>
                    <Card.Meta>
                        <span>{product.category}</span>
                    </Card.Meta>
                    <Card.Description content={`Налично количество: ${product.quantity} ${product.unitAcronym}`} />
                    <Card.Description content={`Продажна цена: ${product.price} лв`} />
                    <Card.Description content={`Доставна цена: ${product.deliveryPrice} лв`} />
                    <Card.Description content={`Мярка: ${product.unitAcronym}`} />
                    <Card.Description content={`Категория: ${product.category}`} />
                    <Card.Description content={`Описание: ${product.description}`} />
                    <Card.Description content={`Създаден на: ${product.createdOn?.toString().split('T')[0]}`} />
                    <Card.Description content={`Променен на: ${product.modifiedOn?.toString().split('T')[0]}`} />
                    <Card.Description content={`${product.isDeleted ? 'Изтрит' : 'Активен'} ${product.isDeleted ? `на ${product.deletedOn}` : ''}`} />
                </Card.Content>
                <Card.Content extra>
                    <ButtonGroup floated="right" >
                        <Button color="yellow" onClick={() => modalStore.openModal(<UpdateProductForm id={id} />, "small")}>Промени</Button>
                        <Button color='red' onClick={() => modalStore.closeModal()} content='Отказ' />
                    </ButtonGroup>
                </Card.Content>
            </Card>
        </Container>
    )
})