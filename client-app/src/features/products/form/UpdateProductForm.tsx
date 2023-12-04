import { ChangeEvent, useEffect, useState } from "react";
import { Button, ButtonGroup, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Product } from "../../../app/models/product";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link, useNavigate, useParams } from "react-router-dom";

export default observer(function ProductForm() {
    const { productStore } = useStore();
    const { updateProduct, loading, loadProduct, loadingInitial } = productStore;

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
        unitAcronym: '',
        description: '',
        createdOn: new Date(),
        modifiedOn: new Date(),
        isDeleted: false,
        deletedOn: null,
        unit: { id: '', acronym: '' }
    })

    useEffect(() => {
        if (id) loadProduct(id).then(product => setProduct(product!))
    }, [id, loadProduct]);

    function handleSubmit() {
        updateProduct(product!).then(() => navigate(`/products/${product.id}`));
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Group key={product!.id} inline widths='equal'>
                    <Form.Input required fluid placeholder='Име' label='Име' value={product!.name} name='name' onChange={handleInputChange} />
                    <Form.Input required fluid placeholder='Продажна цена' type="number" label='Продажна цена' value={product!.price} name='price' onChange={handleInputChange} />
                    <Form.Input required fluid placeholder='Доставна цена' type="number" label='Доставна цена' value={product!.deliveryPrice} name='deliveryPrice' onChange={handleInputChange} />
                    <Form.Input fluid placeholder='Описание' label='Допълнително описание' value={product!.description} name='description' onChange={handleInputChange} />
                </Form.Group>
                <ButtonGroup floated="right" >
                    <Button loading={loading} type='submit' positive>Изпрати</Button>
                    <Button as={Link} to='/products' color='red' type="button" content='Отказ' />
                </ButtonGroup>
            </Form>
        </Segment>
    )
})
