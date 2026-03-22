import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Checkbox, Container, Header, Segment } from "semantic-ui-react";
import MyCustomInput from "../../../app/common/form/MyCustomInput";
import { Partner } from "../../../app/models/partner";
import { useStore } from "../../../app/stores/store";

export default observer(function PartnerEdit() {
    const { modalStore, partnerStore } = useStore();
    const { editPartner, loading, selectedPartner: partner, } = partnerStore;

    function handleFormSubmit(partner: Partner) {
        editPartner(partner).then(() => modalStore.closeModals('PartnerEdit'));

    }

    return (
        <>
            {partner && (
                <Container>
                    <Header>{`Редактиране на фирма "${partner.name}"`}</Header>
                    <Segment clearing size="small" >
                        <Formik enableReinitialize initialValues={partner} onSubmit={(values) => handleFormSubmit(values)}>
                            {({ handleSubmit, setFieldValue, values }) => (
                                <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                                    <MyCustomInput placeholder='Име' label='Име' name='name' />
                                    <MyCustomInput placeholder='МОЛ' label='МОЛ' name='companyOwnerName' />
                                    <MyCustomInput placeholder='Телефон' label='Телефон' name='phone' />
                                    <MyCustomInput placeholder='Имейл' label='Имейл' name='email' />
                                    <MyCustomInput placeholder='Град' label='Град' name='city' />
                                    <MyCustomInput placeholder='Адрес' label='Адрес' name='address' />
                                    <div className="partner-create_company-check_fields">
                                        {!partner.isClient && (
                                            <Checkbox
                                                checked={values.isClient}
                                                onChange={() => {
                                                    setFieldValue('isClient', !values.isClient);
                                                }}
                                                label="Клиент"
                                                toggle
                                            />
                                        )}
                                        {!partner.isSupplier && (
                                            <Checkbox
                                                checked={values.isSupplier}
                                                onChange={() => {
                                                    setFieldValue('isSupplier', !values.isSupplier);
                                                }}
                                                label="Доставчик"
                                                toggle
                                            />
                                        )}
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                                        <Button type='button' onClick={() => modalStore.closeModals('PartnerEdit')} content='Откажи' color="red" />
                                        <Button loading={loading} type='submit' positive content='Запази' />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Segment>
                </Container>
            )}
        </>
    );
});