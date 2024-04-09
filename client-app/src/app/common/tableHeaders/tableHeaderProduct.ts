export const tableHeaderProduct: { key: string, label: string }[] = [
    { key: "name", label: "Име" },
    { key: "quantity", label: "Количество" },
    { key: "deliveryPrice", label: "Доставна цена" },
    { key: "price", label: "Продажна цена" },
    { key: "category", label: "Категория" },
    { key: "unitAcronym", label: "Мярка" },
    { key: "description", label: "Описание" },
];

export const productTableHeader: { key: string, label: string }[] = [
    { key: "name", label: "Име" },
    { key: "category", label: "Категория" },
    { key: "unitAcronym", label: "Мярка" },
    { key: "quantity", label: "Количество" },
    { key: "price", label: "Единична цена" },
    { key: "total", label: "Общо без ДДС" },
    { key: "vat", label: "ДДС" },
    { key: "totalPrice", label: "Крайна цена" },
];

export const orderProductTableHeader: { key: string, label: string }[] = [
    { key: "name", label: "Продукт" },
    { key: "category", label: "Категория" },
    { key: "unit", label: "Мярка" },
    { key: "quantity", label: "Количество" },
    { key: "price", label: "Ед.цена" },
    { key: "total", label: "Общо" },
];
// <Table.HeaderCell>Продукт < /Table.HeaderCell>
// < Table.HeaderCell > Мерна единица < /Table.HeaderCell>
// < Table.HeaderCell > Категория < /Table.HeaderCell>
// < Table.HeaderCell > Количество < /Table.HeaderCell>
// < Table.HeaderCell > Ед.цена < /Table.HeaderCell>
// < Table.HeaderCell > Общо < /Table.HeaderCell>
// < Table.HeaderCell > Действия < /Table.HeaderCell>