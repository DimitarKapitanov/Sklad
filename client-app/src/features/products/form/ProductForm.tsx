import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Header, Segment } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { PagingParams } from "../../../app/models/pagination";
import { Product } from "../../../app/models/product";
import { useStore } from "../../../app/stores/store";
import CustomSelect from "../../orders/form/CustomSelect";
import ProductTable from "./ProductTable";
import RevealButton from "../../../app/common/buttons/RevealButton";
import PartnerCreate from "../../partners/partnerCreate/PartnerCreate";

interface FormValues {
	products: Product[];
	deliveryCompany: string;
}

export default observer(function TestProductForm() {
	const { productStore, commonStore, unitStore, supplierStore, categoryStore, modalStore } = useStore();
	const { validationSchema } = commonStore;
	const { openModal } = modalStore;

	const { createProduct, loading, loadingInitial } = productStore;
	const { loadUnits, unitRegistry } = unitStore;
	const { loadSuppliers, supplierRegistry, supplierOptions, setPagingParams, pagination } = supplierStore;
	const { loadCategories, categoryRegistry } = categoryStore;
	const navigate = useNavigate();

	const [products] = useState<Product[]>([]);

	const [, setLoadingNext] = useState(false);
	useEffect(() => {
		if (categoryRegistry.size < 1) loadCategories();
	}, [loadCategories, categoryRegistry.size]);

	useEffect(() => {
		if (unitRegistry.size < 1) loadUnits();
	}, [loadUnits, unitRegistry.size]);

	useEffect(() => {
		if (supplierRegistry.size < 1) loadSuppliers();
	}, [loadSuppliers, supplierRegistry.size]);

	function handleProductSubmit(products: Product[], deliveryCompanyId: string) {
		products.forEach((product) => {
			product.id = uuid();
		});
		createProduct(deliveryCompanyId, products)
			.then(() => navigate("/products"))
			.catch((error) => console.log(error));
	}

	function mapToSelectOptions(items: { [key: string]: string }[], valueKey: string, labelKey: string) {
		return items.map((item) => ({
			value: item[valueKey],
			label: item[labelKey],
		}));
	}

	function handleGetNext() {
		setLoadingNext(true);
		setPagingParams(new PagingParams(pagination!.currentPage + 1));
		loadSuppliers().then(() => setLoadingNext(false));
	}

	if (loadingInitial) return <LoadingComponent content="Зареждане..." />;

	return (
		<>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
				<Header as={"h1"} content="Доставка" />
				<RevealButton
					visibleContent="Добави партньор"
					hiddenContent="Kъм формата"
					onClick={() => openModal(<PartnerCreate isOpenInModal={true} />, "large")}
				/>
			</div>
			<Segment clearing>
				<Formik
					validationSchema={validationSchema}
					initialValues={{ products, deliveryCompany: "" } as FormValues}
					onSubmit={(values: FormValues) => handleProductSubmit(values.products, values.deliveryCompany)}
				>
					{({ values, handleSubmit, setFieldValue, isValid, isSubmitting, dirty }) => (
						<Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
							{values.deliveryCompany ? (
								<ProductTable setFieldValue={setFieldValue} deliveryCompany={values.deliveryCompany} products={values.products} />
							) : (
								<div style={{ maxWidth: "300px", margin: "0 auto" }}>
									<CustomSelect
										options={mapToSelectOptions(supplierOptions, "value", "text")}
										name="deliveryCompany"
										placeholder="Изберете доставчик"
										onMenuScrollToBottom={() => {
											handleGetNext();
										}}
									/>
								</div>
							)}
							<ButtonGroup floated="right" style={{ marginTop: 20 }}>
								<Button as={Link} to="/products" color="red" type="button" content="Отказ" />
								<Button
									disabled={isSubmitting || !dirty || !isValid || values.products.length <= 0}
									loading={loading}
									type="submit"
									positive
								>
									Изпрати
								</Button>
							</ButtonGroup>
						</Form>
					)}
				</Formik>
			</Segment>
		</>
	);
});