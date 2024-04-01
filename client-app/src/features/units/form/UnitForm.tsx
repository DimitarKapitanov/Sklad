import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, ButtonGroup, Form, Segment } from "semantic-ui-react";
import { v4 as uuid } from 'uuid';
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Unit } from "../../../app/models/unit";
import { useStore } from "../../../app/stores/store";

export default function UnitForm() {
    const { unitStore } = useStore()
    const navigate = useNavigate();
    const { id } = useParams();

    const { loadUnit, loading, createUnit, updateUnit, loadingInitial } = unitStore;
    const [unit, setUnit] = useState<Unit>({
        id: '',
        acronym: ''
    });

    useEffect(() => {
        if (id) {
            loadUnit(id).then(unit => setUnit(unit!));
        }
    }, [id, loadUnit]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setUnit({ ...unit, [name]: value });
    };

    function handleSubmit() {
        if (!unit.id) {
            unit.id = uuid();
            createUnit(unit).then(() => navigate(`/`));
        } else {
            updateUnit(unit).then(() => navigate(`/`));
        }
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <>
            <Segment clearing >
                <Form onSubmit={handleSubmit} autoComplete='off' widths="equal" style={{ width: '30%', margin: '0 auto' }}>
                    <Form.Input required placeholder='Мерна единица' label='Мерна единица' name='acronym' onChange={handleInputChange} />
                    <ButtonGroup floated="right" >
                        <Button loading={loading} type='submit' positive>Изпрати</Button>
                        <Button as={Link} to='/products' color='red' type="button" content='Отказ' />
                    </ButtonGroup>
                </Form>
            </Segment>
        </>
    )
}