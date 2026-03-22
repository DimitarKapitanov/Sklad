import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header } from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { Product } from "../../../app/models/product";
import { Unit } from "../../../app/models/unit";
import { useStore } from "../../../app/stores/store";
import CategoriesForm from "../../categories/form/CategoriesForm";

const product: Product = {
	id: "",
	name: "",
	quantity: 0,
	deliveryPrice: "",
	price: "",
	categoryId: "",
	categoryName: "",
	unitId: "",
	unitAcronym: "",
	description: "",
	createdOn: new Date(),
	modifiedOn: new Date(),
	isDeleted: false,
	deletedOn: null,
	unitDto: { id: "", acronym: "" },
};

interface Props {
	products: Product[];
	setFieldValue: (field: string, value: Product[], shouldValidate?: boolean) => void;
}
export default observer(function ProductCreate(props: Props) {
	const {
		unitStore,
		categoryStore: { categoryProductOptions },
		modalStore,
		commonStore: { validationSchemaAddProduct },
	} = useStore();
	const { unitSort } = unitStore;

	const categoryOptionsWithAddNew = [
		...categoryProductOptions,
		{
			key: "add-new-category",
			value: "add-new-category",
			text: "➕ Добави нова категория",
		},
	];

	const unitOptions = unitSort.map((unit: Unit) => ({
		text: unit.acronym!,
		value: unit.acronym!,
		key: unit.id!,
	}));

	function handleCategoryChange(categoryId: string) {
		if (categoryId === "add-new-category") {
			modalStore.openModal(<CategoriesForm />, "small");
		}
	}
	function handleUnitChange(option: { text: string; value: string; key?: string | undefined }) {
		if (option.key !== undefined) {
			product.unitId = option.key;
			product.unitDto.id = option.key;
			product.unitDto.acronym = option.value;
		}
	}

	function setCategoryName(categoryId: string) {
		const name = categoryProductOptions.find((x) => x.key === categoryId)?.text;
		if (name != undefined) {
			product.categoryName = name;
		}
		return product.categoryName;
	}

	function handleAddProduct(values: Product) {
		values.id = uuid();
		values.categoryName = setCategoryName(values.categoryId);
		values.unitId = values.unitDto.id;
		props.setFieldValue("products", [...props.products, values]);
		modalStore.closeModal();
	}

	return (
		<>
			<Header as="h2" content="Добави продукт" textAlign="center" />
			<Formik initialValues={product} onSubmit={(values) => handleAddProduct(values)} validationSchema={validationSchemaAddProduct}>
				{({ isSubmitting, isValid, dirty, setFieldValue }) => (
					<Form className="ui form" autoComplete="off">
						<MyTextInput placeholder="Име" name={`name`} />
						{/* <MySelectInput options={categoryProductOptions} placeholder="Категория" name={`categoryId`} /> */}
						<MySelectInput
							options={categoryOptionsWithAddNew}
							placeholder="Категория"
							name={`categoryId`}
							onSelected={(option) => {
								if (option.value === "add-new-category") {
									handleCategoryChange(option.value);
									setFieldValue("categoryId", "");
								}
							}}
						/>
						<MyTextInput placeholder="Количество" name={`quantity`} />
						<MySelectInput
							onSelected={(option) => handleUnitChange(option)}
							options={unitOptions}
							placeholder="Мярка"
							name={`unitAcronym`}
						/>
						<MyTextInput placeholder="Доставна цена" name={`deliveryPrice`} />
						<MyTextInput placeholder="Продажна цена" name={`price`} />
						<MyTextArea rows={1} placeholder="Описание" name={`description`} />
						<div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
							<Button onClick={() => modalStore.closeModal()} type="button" color="red">
								Назад
							</Button>
							<Button type="submit" disabled={isSubmitting || !isValid || !dirty} positive>
								Добави
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
});