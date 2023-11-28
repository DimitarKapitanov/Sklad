import { Button, ButtonGroup, Card, } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

export default observer(function ProductDetails() {

    const { productStore } = useStore();
    const { selectedProduct: product, openForm, cancelSelectedProduct } = productStore;

    if (!product) return <LoadingComponent/>;

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{product.name}</Card.Header>
                <Card.Meta>
                    <span>{product.category}</span>
                </Card.Meta>
                <Card.Description content={`Налично количество ${product.quantity} бр`}/>
                <Card.Description content={`Продажна цена ${product.price} лв`}/>
                <Card.Description content={`Доставна цена ${product.deliveryPrice} лв`}/>
                <Card.Description content={`Мярка ${product.unitAcronym}`}/>
                <Card.Description content={`Категория ${product.category}`}/>
                <Card.Description content={`Описание ${product.description}`}/>
                <Card.Description content={`Създаден на ${product.createdOn?.toString().split('T')[0]}`}/>
                <Card.Description content={`Променен на ${product.modifiedOn?.toString().split('T')[0]}`}/>
                <Card.Description content={`${product.isDeleted ? 'Изтрит' : 'Активен'} ${product.isDeleted ? `на ${product.deletedOn}`: ''}`}/>
            </Card.Content>
            <Card.Content extra>
            <ButtonGroup floated="right" >
                <Button color="yellow" onClick={()=> openForm(product.id)}>Промени</Button>
                <Button color='red' content='Отказ' onClick={cancelSelectedProduct} />
            </ButtonGroup>
            </Card.Content>
        </Card>
    )
})