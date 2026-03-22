import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Container, Divider, Header, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import MyCustomInput from "../../../app/common/form/MyCustomInput";
import { NewPartner } from "../../../app/models/newPartner";
import { DeliveryAddress } from "../../../app/models/partner";
import { useStore } from "../../../app/stores/store";
import CompanyInfoFields from "./CompanyInfoFields";
import DeliveryAddressesTable from "./DeliveryAddressesTable";

interface Props {
	// add optional props here if component is open in modal
	isOpenInModal?: boolean;
}

export default observer(function PartnerCreate({ isOpenInModal }: Props) {
	const navigate = useNavigate();

	const { partnerStore, commonStore, modalStore } = useStore();
	const { newPartnerValidationSchema } = commonStore;
	const { createPartner } = partnerStore;

	const submitCreatePartner = async (values: NewPartner) => {
		values.createCompanyDto.id = uuid();
		values.companyId = values.createCompanyDto.id;

		await createPartner(values);
		if (!isOpenInModal) {
			navigate("/partners");
		} else {
			modalStore.closeModal();
		}
	};

	const initialPartner: NewPartner = {
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
	};

	return (
		<Container style={{ marginTop: "40px" }}>
			<Segment clearing>
				<Formik
					initialValues={{
						...initialPartner,
						deliveryAddress: {
							address: "",
							city: "",
						},
					}}
					onSubmit={(values) => {
						const { ...rest } = values;
						submitCreatePartner({
							...rest,
						});
					}}
					validationSchema={newPartnerValidationSchema}
				>
					{({ handleSubmit, values, setFieldValue, dirty, isSubmitting, isValid, errors }) => {
						// Преместваме функциите тук, за да имат достъп до Formik's setFieldValue
						const addDeliveryAddress = (address: string, city: string) => {
							const newAddress: DeliveryAddress = {
								id: uuid(),
								partnerId: values.id,
								address: address,
								city: city,
							};
							const updatedAddresses = [...values.deliveryAddresses, newAddress];
							setFieldValue("deliveryAddresses", updatedAddresses);
						};

						const removeDeliveryAddress = (id: string) => {
							const filteredAddresses = values.deliveryAddresses.filter((address) => address.id !== id);
							setFieldValue("deliveryAddresses", filteredAddresses);
						};

						console.log("🔍 Current errors:", errors);
						console.log("📊 Form state:", { dirty, isValid, isSubmitting });

						return (
							<Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
								<div className="partner-create">
									<div className="partner-create_company">
										<Header as="h3">Информация за фирма</Header>
										<div className="partner-create_company-check_fields">
											<Checkbox
												checked={values.createCompanyDto.isClient}
												onChange={() => {
													setFieldValue("createCompanyDto.isClient", !values.createCompanyDto.isClient);
												}}
												label="Клиент"
												toggle
											/>
											<Checkbox
												checked={values.createCompanyDto.isSupplier}
												onChange={() => {
													setFieldValue("createCompanyDto.isSupplier", !values.createCompanyDto.isSupplier);
												}}
												label="Доставчик"
												toggle
											/>
										</div>
									</div>
									{(values.createCompanyDto.isClient || values.createCompanyDto.isSupplier) && (
										<CompanyInfoFields
											isClient={values.createCompanyDto.isClient}
											isSupplier={values.createCompanyDto.isSupplier}
										/>
									)}
								</div>
								<div>
									{values.createCompanyDto.isClient && (
										<>
											<Divider />
											<div className="partner-delivery">
												<Header as="h3">Информация за клиент</Header>
												<div className="partner-delivery-addresses">
													<div className="partner-delivery-addresses-fields">
														<MyCustomInput name={"deliveryAddress.city"} placeholder="Град" />
														<MyCustomInput name="deliveryAddress.address" placeholder="Адрес" />
														<Button
															icon="add"
															positive
															disabled={values.deliveryAddress.address === "" || values.deliveryAddress.city === ""}
															onClick={() => {
																addDeliveryAddress(values.deliveryAddress.address, values.deliveryAddress.city);
																setFieldValue("deliveryAddress.city", "");
																setFieldValue("deliveryAddress.address", "");
															}}
															content="Добави"
														/>
													</div>
													{values.deliveryAddresses.length > 0 && (
														<DeliveryAddressesTable
															deliveryAddresses={values.deliveryAddresses}
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
										(values.deliveryAddresses.length === 0 && values.createCompanyDto.isClient)
									}
									onClick={() => {
										console.log("🔘 Submit button clicked");
										console.log("📊 Current form state:", {
											dirty,
											isValid,
											isSubmitting,
											errors,
											hasDeliveryAddresses: values.deliveryAddresses?.length || 0,
											isClient: values.createCompanyDto.isClient,
										});
										console.log("📝 Current values:", values);
									}}
								>
									Създай
								</Button>
								<Button color="red" as={Link} to={"/partners"} floated="right">
									Назад
								</Button>
							</Form>
						);
					}}
				</Formik>
			</Segment>
		</Container>
	);
});
