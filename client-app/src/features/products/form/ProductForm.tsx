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
    const { createProduct, loading, loadProduct, loadingInitial } = productStore;

    const navigate = useNavigate();
    const { id } = useParams();

    const [products, setProducts] = useState<Product[]>([{
        id: '',
        name: '',
        quantity: 0,
        deliveryPrice: 0,
        price: 0,
        category: '',
        unitId: '00000000-0000-0000-0000-000000000003',
        unitAcronym: '',
        description: '',
        createdOn: new Date(),
        modifiedOn: new Date(),
        isDeleted: false,
        deletedOn: null,
        unit: { id:'00000000-0000-0000-0000-000000000003', acronym: ''}
    }]);
    const [additionalRows, setAdditionalRows] = useState<number>(1);

    function handleAddRow(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        setAdditionalRows(prevRows => prevRows + 1);
        setProducts(prevProducts => [...prevProducts, {
            id: '',
            name: '',
            quantity: 0,
            deliveryPrice: 0,
            price: 0,
            category: '',
            unitId: '00000000-0000-0000-0000-000000000001',
            unitName: '',
            unitAcronym: '',
            description: '',
            createdOn: new Date(),
            modifiedOn: new Date(),
            isDeleted: false,
            deletedOn: null,
            unit: { id:'', acronym: '', name: ''}
        }]);
    }

    function handleRemoveRow(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        if (additionalRows > 1) {
            setAdditionalRows(prevRows => prevRows - 1);
            setProducts(prevProducts => prevProducts.slice(0, -1));
        }
    }

    useEffect(() => {
        if (id) loadProduct(id).then(product => setProducts(products => [...products, product!]))
    }, [id, loadProduct]);

    function handleSubmit() {
        products.forEach(product => { product.id = uuid() });
        createProduct(products).then(() => navigate('/products'));
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const { name, value } = event.target;
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], [name]: value };
        setProducts(newProducts);
    };

    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                {products.map((product, index) => (
                    <Form.Group key={index} inline widths='equal'>
                        <Form.Input required fluid placeholder='Име' label='Име' value={product.name} name='name' onChange={(e) => handleInputChange(e, index)} />
                        <Form.Input required fluid placeholder='Продажна цена' type="number" label='Продажна цена' value={product.price} name='price' onChange={(e) => handleInputChange(e, index)} />
                        <Form.Input required fluid placeholder='Доставна цена' type="number" label='Доставна цена' value={product.deliveryPrice} name='deliveryPrice' onChange={(e) => handleInputChange(e, index)} />
                        <Form.Input fluid placeholder='Описание' label='Допълнително описание' value={product.description} name='description' onChange={(e) => handleInputChange(e, index)} />
                        <Form.Input fluid required placeholder='Категория' type="text" label='Категория' value={product.category} name='category' onChange={(e) => handleInputChange(e, index)} />
                        <Form.Input fluid required placeholder='Мярка' type="text" label='Мярка' value={product.unitAcronym} name='unitAcronym' onChange={(e) => handleInputChange(e, index)} />
                        <Form.Input fluid required placeholder='Количество' type="number" label='Количество' value={product.quantity} name='quantity' onChange={(e) => handleInputChange(e, index)} />
                    </Form.Group>
                ))}
                <ButtonGroup floated="right" >
                    <Button loading={loading} type='submit' positive>Изпрати</Button>
                    <Button as={Link} to='/products' color='red' type="button" content='Отказ' />
                </ButtonGroup>
                <ButtonGroup floated="left" >
                    <Button positive content='Добави ред' onClick={handleAddRow} />
                    <Button content='Изтрий' onClick={handleRemoveRow} />
                </ButtonGroup>
            </Form>
        </Segment>
    )
})
