import { MouseEventHandler, useCallback, useState } from "react";
import { Product } from "../../../app/models/product";
import { Button, Icon, Table } from "semantic-ui-react";

interface Props {
    products: Product[];
    selectProduct: (id: string) => void;
    deleteProduct: (id: string) => void;
}

type Data = Product[];
type SortKeys = keyof Data[0];
type SortOrder = "asc" | "desc";

function sortData({
    tableData,
    sortKey,
    reverse
}: {
    tableData: Data;
    sortKey: SortKeys;
    reverse: boolean;
}) {
    if (!sortKey) return tableData;

    const sortedData = tableData.sort((a, b) => {
        return a[sortKey] > b[sortKey] ? 1 : -1;
    });

    if (reverse) return sortedData.reverse();
    return sortedData
}

function SortButton({
    sortOrder, columnKey, sortKey, onClick} : {
        sortOrder: SortOrder;
        columnKey: SortKeys;
        sortKey: SortKeys;
        onClick: MouseEventHandler<HTMLButtonElement>;
    }) {
        return <Button onClick={onClick} className={`${sortKey === columnKey && sortOrder === 'desc' ? "sort-button sort-reverse" : "sort-button"}`}>
            <Icon name="caret up"/>
        </Button>
    }

export default function ProductTable({ products, selectProduct, deleteProduct, }: Props) {

    const [sortKey, setSortKey] = useState<SortKeys>('isDeleted');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const tableHeader: {key: SortKeys, label: string}[] = [
        {key: "name", label: "Име"}, 
        {key: "quantity", label: "Количество"},
        {key: "deliveryPrice", label: "Доставна цена"},
        {key:"price", label:"Продажна цена"},
        {key: "category", label:"Категория"}, 
        {key: "unitAcronym", label:"Мярка"},
        {key: "description",label:"Описание"}, 
        {key: "isDeleted", label:"Edit/Delete"}];

    const sortedData = useCallback(() => sortData({ tableData: products, sortKey, reverse: sortOrder === 'desc' }), [products, sortKey, sortOrder]);

    function changeSort(key: SortKeys): void {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

        setSortKey(key);
    }

    return (
        <Table celled padded selectable>
            <Table.Header>
                <Table.Row>
                    {tableHeader.map((row) => (
                        <Table.HeaderCell key={row.key}>{row.label} <SortButton
                         columnKey={row.key}
                         onClick={() => changeSort(row.key)}
                         {...{sortOrder, sortKey}}
                         />
                         </Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {sortedData().map((product) => (
                    <Table.Row key={product.id}>
                        <Table.Cell>{product.name}</Table.Cell>
                        <Table.Cell>{product.quantity}</Table.Cell>
                        <Table.Cell>{product.deliveryPrice}</Table.Cell>
                        <Table.Cell>{product.price}</Table.Cell>
                        <Table.Cell>{product.category}</Table.Cell>
                        <Table.Cell>{product.unitAcronym}</Table.Cell>
                        <Table.Cell>{product.description}</Table.Cell>
                        <Table.Cell>
                            <Button.Group size="small" icon>
                                <Button color='yellow' onClick={() => selectProduct(product.id)}>
                                    <Icon name="edit" />
                                </Button>
                                <Button.Or text={'или'} />
                                <Button negative onClick={() => deleteProduct(product.id)}>
                                    <Icon name="trash" />
                                </Button>
                            </Button.Group>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}