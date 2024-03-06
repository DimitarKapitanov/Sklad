import { Placeholder, Table } from 'semantic-ui-react';

export default function ProductsListItemPlaceholder() {
    return (
        <>
            {Array.from({ length: 20 }).map((_, index) => (
                <Table.Row key={index} style={{ height: "33.4333" }}>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Table.Cell key={index} style={{ height: "33.4333px" }}>
                            <Placeholder>
                                <Placeholder.Line />
                            </Placeholder>
                        </Table.Cell>
                    ))}
                </Table.Row>
            ))}
        </>
    );
}
