import { FieldArray } from "formik";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import {
  Button,
  ButtonGroup,
  Header,
  Icon,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MyTextInput from "../../../app/common/form/MyTextInput";
// import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { Product } from "../../../app/models/product";
import { Unit } from "../../../app/models/unit";
import { useStore } from "../../../app/stores/store";

const product: Product = {
  id: "",
  name: "",
  quantity: 0,
  deliveryPrice: '',
  price: '',
  categoryId: "",
  unitId: "",
  unitAcronym: "",
  description: "",
  createdOn: new Date(),
  modifiedOn: new Date(),
  isDeleted: false,
  deletedOn: null,
  unitDto: { id: "", acronym: "" },
};

interface Values {
  products: Product[];
  deliveryCompany: string;
}

export default observer(function ProductTable({
  values,
  setFieldValue,
}: {
  values: Values;
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
}) {
  const { unitStore, supplierStore, categoryStore: { categoryOptions } } = useStore();
  const { unitSort } = unitStore;
  const { supplierOptions } = supplierStore;

  const selectedSupplier = supplierOptions.find(
    (s) => s.key === values.deliveryCompany
  );

  const unitOptions = unitSort.map((unit: Unit) => ({
    text: unit.acronym!,
    value: unit.acronym!,
    key: unit.id!,
  }));

  const handleUnitChange = useCallback(
    (
      option: { text: string; value: string; key?: string | undefined },
      index: number
    ) => {
      if (option.key !== undefined) {
        setFieldValue(`products[${index}].unitId`, option.key);
        setFieldValue(`products[${index}].unit.id`, option.key);
        setFieldValue(`products[${index}].unit.acronym`, option.value);
      }
    },
    [setFieldValue]
  );

  return (
    <div>
      <Header textAlign="center">
        <div>
          Доставчик: {selectedSupplier?.text || "Избери доставчик"}
          <Icon
            name="pencil"
            style={{ cursor: "pointer", marginLeft: "5px" }}
            onClick={() => {
              setFieldValue("deliveryCompany", "");
            }}
          />
        </div>
      </Header>
      <FieldArray name="products">
        {({ push, remove }) => (
          <>
            <Table style={{ border: "none" }} unstackable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>№</TableHeaderCell>
                  <TableHeaderCell>Име</TableHeaderCell>
                  <TableHeaderCell>Категория</TableHeaderCell>
                  <TableHeaderCell>Мярка</TableHeaderCell>
                  <TableHeaderCell>Количество</TableHeaderCell>
                  <TableHeaderCell>Продажна цена</TableHeaderCell>
                  <TableHeaderCell>Доставна цена</TableHeaderCell>
                  <TableHeaderCell>Описание</TableHeaderCell>
                  <TableHeaderCell>Премахни</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {values.products.map((_: unknown, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="name" style={{ minWidth: "12vh" }}>
                      <MyTextInput
                        placeholder="Име"
                        name={`products[${index}].name`}
                      />
                    </TableCell>
                    <TableCell className="category">
                      <MySelectInput
                        options={categoryOptions}
                        placeholder="Категория"
                        name={`products[${index}].categoryId`}
                      />
                    </TableCell>
                    <TableCell className="">
                      <MySelectInput
                        onSelected={(option) => handleUnitChange(option, index)}
                        options={unitOptions}
                        placeholder="Мярка"
                        name={`products[${index}].unitAcronym`}
                      />
                    </TableCell>
                    <TableCell>
                      <MyTextInput
                        placeholder="Количество"
                        name={`products[${index}].quantity`}
                      />
                    </TableCell>
                    <TableCell>
                      <MyTextInput
                        placeholder="Продажна цена"
                        name={`products[${index}].price`}
                      />
                    </TableCell>
                    <TableCell>
                      <MyTextInput
                        placeholder="Доставна цена"
                        name={`products[${index}].deliveryPrice`}
                      />
                    </TableCell>
                    <TableCell>
                      <MyTextArea
                        rows={1}
                        placeholder="Описание"
                        name={`products[${index}].description`}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        floated="left"
                        icon="trash"
                        color="red"
                        onClick={(e) => {
                          e.preventDefault(), remove(index);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ButtonGroup floated="left" style={{ paddingBottom: "4px" }}>
              <Button
                positive
                content="Добави ред"
                onClick={(e) => {
                  e.preventDefault();
                  push(product);
                }}
              />
            </ButtonGroup>
          </>
        )}
      </FieldArray>
    </div>
  );
});
