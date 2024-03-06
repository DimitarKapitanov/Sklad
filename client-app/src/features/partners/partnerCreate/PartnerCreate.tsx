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
import MyTextInput from "../../../app/common/form/MyTextInput";
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
    },
    phone: "",
    email: "",
    deliveryAddresses: [],
    isDelivery: false,
    isClient: true,
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
            const { deliveryAddress, isDelivery, ...rest } = values;
            submitCreatePartner({
              ...rest,
              isDelivery: newPartner.isDelivery,
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
                      onChange={() => {
                        setNewPartner({
                          ...newPartner,
                          isClient: !newPartner.isClient,
                        });
                      }}
                      checked={newPartner.isClient}
                      label="Клиент"
                      toggle
                    />
                    <Checkbox
                      checked={newPartner.isDelivery}
                      onChange={() =>
                        setNewPartner({
                          ...newPartner,
                          isDelivery: !newPartner.isDelivery,
                        })
                      }
                      label="Доставчик"
                      toggle
                    />
                  </div>
                </div>
                {(newPartner.isClient || newPartner.isDelivery) && (
                  <CompanyInfoFields
                    isDelivery={newPartner.isDelivery}
                    isClient={newPartner.isClient}
                  />
                )}
              </div>
              <div>
                {newPartner.isClient && (
                  <>
                    <Divider />
                    <div className="partner-delivery">
                      <Header as="h3">Информация за клиент</Header>
                      <div className="partner-delivery-addresses">
                        <div className="partner-delivery-addresses-fields">
                          <MyTextInput
                            name={`deliveryAddress.city`}
                            value={values.deliveryAddress.city}
                            placeholder="Град"
                          />
                          <MyTextInput
                            name={`deliveryAddress.address`}
                            value={values.deliveryAddress.address}
                            placeholder="Адрес"
                          />
                          <Button
                            icon="add"
                            positive
                            disabled={
                              values.deliveryAddress.address === "" ||
                              values.deliveryAddress.city === ""
                            }
                            onClick={(event) => {
                              event.preventDefault();
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
                    newPartner.isClient)
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
