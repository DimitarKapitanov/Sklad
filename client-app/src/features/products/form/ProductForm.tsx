import { ChangeEvent, useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Product } from "../../../app/models/product";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from 'uuid';

export default observer(function ProductForm() {
    const { productStore } = useStore();
    const { createProduct, updateProduct, loading,
        loadProduct, loadingInitial } = productStore;

    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState<Product>({
        id: '',
        name: '',
        quantity: 0,
        deliveryPrice: 0,
        price: 0,
        category: '',
        unitId: '',
        unitName: '',
        unitAcronym: '',
        description: '',
        createdOn: new Date(),
        modifiedOn: new Date(),
        isDeleted: false,
        deletedOn: null,
    })

    useEffect(() => {
        if (id) loadProduct(id).then(product => setProduct(product!))
    }, [id, loadProduct]);

    function handleSubmit() {
        if (!product.id) {
            product.id = uuid();
            product.unitId = '00000000-0000-0000-0000-000000000001';
            createProduct(product).then(() => navigate(`/products/${product.id}`));
        } else {
            updateProduct(product).then(() => navigate(`/products/${product.id}`));
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    }


    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Име' label='Име' value={product.name} name='name' onChange={handleInputChange} />
                <Form.Input placeholder='Продажна цена' type="number" label='Продажна цена' value={product.price} name='price' onChange={handleInputChange} />
                <Form.Input placeholder='Доставна цена' type="number" label='Доставна цена' value={product.deliveryPrice} name='deliveryPrice' onChange={handleInputChange} />
                <Form.TextArea placeholder='Описание' label='Допълнително описание' value={product.description} name='description' onChange={handleInputChange} />
                {!product.id &&
                    <>
                        <Form.Input placeholder='Категория' type="text" label='Категория' value={product.category} name='category' onChange={handleInputChange} />
                        <Form.Input placeholder='Мярка' type="text" label='Мярка' value={product.unitAcronym} name='unitAcronym' onChange={handleInputChange} />
                        <Form.Input placeholder='Количество' type="number" label='Количество' value={product.quantity} name='quantity' onChange={handleInputChange} />
                        <Form.Input placeholder='Име на мерната единица' type="text" value={product.unitName} name='unitName' onChange={handleInputChange} />
                    </>
                }

                <ButtonGroup floated="right" >
                    <Button loading={loading} type='submit' positive>Изпрати</Button>
                    <Button as={Link} to='/products' color='red' type="button" content='Отказ' />
                </ButtonGroup>
            </Form>
        </Segment>
    )
})
