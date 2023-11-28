import { SyntheticEvent, useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";


// type Data = Product[];
// type SortKeys = keyof Data[0];
// type SortOrder = "asc" | "desc";

// function sortData({
//     tableData,
//     sortKey,
//     reverse
// }: {
//     tableData: Data;
//     sortKey: SortKeys;
//     reverse: boolean;
// }) {
//     if (!sortKey) return tableData;

//     const sortedData = tableData.sort((a, b) => {
//         return a[sortKey] ?? '' > (b[sortKey] ?? '')  ? 1 : -1;
//     });

//     if (reverse) return sortedData.reverse();
//     return sortedData
// }

// function SortButton({
//     sortOrder, columnKey, sortKey, onClick 
// }: {
//         sortOrder: SortOrder;
//         columnKey: SortKeys;
//         sortKey: SortKeys;
//         onClick: MouseEventHandler<HTMLAnchorElement>;
//     }) {
//     return <a onClick={onClick} className={`${sortKey === columnKey && sortOrder === 'desc' ? "sort-button sort-reverse" : "sort-button"}`}>
//         <Icon name="caret up" />
//     </a>
// }

export default observer(function ProductTable() {
    const {productStore} = useStore();
    const {productsByName, deleteProduct, loading} = productStore;

    // const [sortKey, setSortKey] = useState<SortKeys>('name');
    // const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // const tableHeader: { key: SortKeys, label: string }[] = [
    //     { key: "name", label: "Име" },
    //     { key: "quantity", label: "Количество" },
    //     { key: "deliveryPrice", label: "Доставна цена" },
    //     { key: "price", label: "Продажна цена" },
    //     { key: "category", label: "Категория" },
    //     { key: "unitAcronym", label: "Мярка" },
    //     { key: "description", label: "Описание" },
    //     { key: "isDeleted", label: "Edit/Delete" }];

        const tableHeader = [ "Име", "Количество", "Доставна цена", "Продажна цена", "Категория", "Мярка", "Описание", "Edit/Delete" ];

    // const sortedData = useCallback(() => sortData({ tableData: products, sortKey, reverse: sortOrder === 'desc' }), [products, sortKey, sortOrder]);

    // function changeSort(key: SortKeys): void {
    //     setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

    //     setSortKey(key);
    // }

    const [target, setTarget] = useState('');

    function handleDeleteProduct(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteProduct(id);
    }


    return (
        <Table celled padded selectable className="product-table">
            <Table.Header>
                <Table.Row className="product-tale-head">
                    {tableHeader.map((row) => (
                        <Table.HeaderCell key={row} className="table-header">{row}</Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {productsByName.map((product) => (
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
                                <Button color='yellow' onClick={() => productStore.slelectProduct(product.id)}>
                                    <Icon name="edit" />
                                </Button>
                                <Button.Or text={'или'} />
                                <Button negative loading={loading && target === product.id} name={product.id} onClick={(e) => handleDeleteProduct(e, product.id)}>
                                    <Icon name="trash" />
                                </Button>
                            </Button.Group>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
})