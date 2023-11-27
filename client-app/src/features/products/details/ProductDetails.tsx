import { Button, ButtonGroup, Card, } from "semantic-ui-react";
import { Product } from "../../../app/models/product";

interface Props {
    product: Product;
    cancelSelectProduct: () => void;
    openForm: (id: string) => void;
}

export default function ProductDetails({ product, cancelSelectProduct, openForm }: Props) {
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
                <Card.Description content={`Създаден на ${product.createdOn}`}/>
                <Card.Description content={`Променен на ${product.modifiedOn}`}/>
                <Card.Description content={`${product.isDeleted ? 'Изтрит' : 'Активен'} ${product.isDeleted ? `на ${product.deletedOn}`: ''}`}/>
            </Card.Content>
            <Card.Content extra>
            <ButtonGroup floated="right" >
                <Button color="yellow" onClick={()=> openForm(product.id)}>Промени</Button>
                <Button color='red' content='Отказ' onClick={cancelSelectProduct} />
            </ButtonGroup>
            </Card.Content>
        </Card>
    )
}