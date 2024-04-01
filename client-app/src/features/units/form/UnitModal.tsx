import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { v4 as uuid } from 'uuid';
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Unit } from "../../../app/models/unit";
import { useStore } from "../../../app/stores/store";

export default function UnitModal() {
    const { unitStore, modalStore } = useStore()
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
            createUnit(unit).then(() => modalStore.closeModal());
        } else {
            updateUnit(unit).then(() => modalStore.closeModal());
        }
    }

    if (loadingInitial) return <LoadingComponent content='Зареждане...' />

    return (
        <Form onSubmit={handleSubmit} autoComplete='off' widths="equal">
            <Form.Input required placeholder='Мерна единица' label='Мерна единица' name='acronym' onChange={handleInputChange} />
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button loading={loading} type='submit' positive>Добави</Button>
                <Button onClick={() => modalStore.closeModal()} color='red' type="button" content='Отказ' />
            </div>
        </Form>
    )
}