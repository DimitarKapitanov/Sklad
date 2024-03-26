import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Header,
  Segment,
} from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import MyCustomInput from "../../../app/common/form/MyCustomInput";
import { NewPartner } from "../../../app/models/newPartner";
import { DeliveryAddress } from "../../../app/models/partner";
import { useStore } from "../../../app/stores/store";
import CompanyInfoFields from "./CompanyInfoFields";
import DeliveryAddressesTable from "./DeliveryAddressesTable";

export default observer(function PartnerCreate() {
  const navigate = useNavigate();

  const { partnerStore, commonStore } = useStore();
  const { newPartnerValidationSchema } = commonStore;
  const { createPartner } = partnerStore;

  const submitCreatePartner = async (values: NewPartner) => {
    values.createCompanyDto.id = uuid();
    values.companyId = values.createCompanyDto.id;
    await createPartner(values);
    navigate("/partners");
  };

  const addDeliveryAddress = (address: string, city: string) => {
    const addresses: DeliveryAddress[] = newPartner.deliveryAddresses;
    addresses.push({
      id: uuid(),
      partnerId: newPartner.id,
      address: address,
      city: city,
    });
    setNewPartner({ ...newPartner, deliveryAddresses: addresses });
  };

  const removeDeliveryAddress = (id: string) => {
    const addresses: DeliveryAddress[] = [];
    newPartner.deliveryAddresses.forEach((address) => {
      if (address.id !== id) addresses.push(address);
    });
    setNewPartner({ ...newPartner, deliveryAddresses: addresses });
  };

  const [newPartner, setNewPartner] = useState<NewPartner>({
    id: uuid(),
    companyId: "",
    createCompanyDto: {
      id: "",
      name: "",
      city: "",
      address: "",
      bulstat: "",
      phone: "",
      email: "",
      companyOwnerName: "",
      isSupplier: false,
      isClient: true,
    },
    phone: "",
    email: "",
    deliveryAddresses: [],
  });

  return (
    <Container>
      <Segment clearing>
        <Formik
          initialValues={{
            ...newPartner,
            deliveryAddress: {
              address: "",
              city: "",
            },
          }}
          onSubmit={(values) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { deliveryAddress, ...rest } = values;
            submitCreatePartner({
              ...rest,
            });
          }}
          validationSchema={newPartnerValidationSchema}
        >
          {({
            handleSubmit,
            values,
            setFieldValue,
            dirty,
            isSubmitting,
            isValid,
          }) => (
            <Form
              className="ui form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="partner-create">
                <div className="partner-create_company">
                  <Header as="h3">Информация за фирма</Header>
                  <div className="partner-create_company-check_fields">
                    <Checkbox
                      checked={values.createCompanyDto.isClient}
                      onChange={() => {
                        setFieldValue('createCompanyDto.isClient', !values.createCompanyDto.isClient);
                      }}
                      label="Клиент"
                      toggle
                    />
                    <Checkbox
                      checked={values.createCompanyDto.isSupplier}
                      onChange={() => {
                        setFieldValue('createCompanyDto.isSupplier', !values.createCompanyDto.isSupplier);
                      }}
                      label="Доставчик"
                      toggle
                    />
                  </div>
                </div>
                {(newPartner.createCompanyDto.isClient || newPartner.createCompanyDto.isSupplier) && (
                  <CompanyInfoFields
                    isSupplier={newPartner.createCompanyDto.isSupplier}
                    isClient={newPartner.createCompanyDto.isClient}
                  />
                )}
              </div>
              <div>
                {newPartner.createCompanyDto.isClient && (
                  <>
                    <Divider />
                    <div className="partner-delivery">
                      <Header as="h3">Информация за клиент</Header>
                      <div className="partner-delivery-addresses">
                        <div className="partner-delivery-addresses-fields">
                          <MyCustomInput
                            name={'deliveryAddress.city'}
                            placeholder="Град"
                          />
                          <MyCustomInput
                            name='deliveryAddress.address'
                            placeholder="Адрес"
                          />
                          <Button
                            icon="add"
                            positive
                            disabled={
                              values.deliveryAddress.address === "" ||
                              values.deliveryAddress.city === "" || !isValid || !dirty
                            }
                            onClick={() => {
                              // event.preventDefault();
                              addDeliveryAddress(
                                values.deliveryAddress.address,
                                values.deliveryAddress.city
                              );
                              setFieldValue("deliveryAddress.city", "");
                              setFieldValue("deliveryAddress.address", "");
                            }}
                            content="Добави"
                          />
                        </div>
                        {newPartner.deliveryAddresses.length > 0 && (
                          <DeliveryAddressesTable
                            deliveryAddresses={newPartner.deliveryAddresses}
                            removeDeliveryAddress={removeDeliveryAddress}
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <Button
                color="green"
                floated="right"
                type="submit"
                disabled={
                  (!dirty && !isValid) ||
                  isSubmitting ||
                  (newPartner.deliveryAddresses.length === 0 &&
                    newPartner.createCompanyDto.isClient)
                }
              >
                Създай
              </Button>
              <Button color="red" as={Link} to={"/partners"} floated="right">
                Назад
              </Button>
            </Form>
          )}
        </Formik>
      </Segment>
    </Container>
  );
});
