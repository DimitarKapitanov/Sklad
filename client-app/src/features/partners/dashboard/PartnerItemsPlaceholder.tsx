import { Placeholder, Table } from "semantic-ui-react";

export default function PartnerItemsPlaceholder() {
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Table.Cell key={index} style={{ height: "33.4333px" }}>
                            <Placeholder>
                                <Placeholder.Line />
                            </Placeholder>
                        </Table.Cell>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {Array.from({ length: 20 }).map((_, rowIndex) => (
                    <Table.Row key={rowIndex} style={{ height: "33.4333" }}>
                        {Array.from({ length: 8 }).map((_, CellIndex) => (
                            <Table.Cell key={rowIndex + '-' + CellIndex} style={{ height: "33.4333px" }}>
                                <Placeholder>
                                    <Placeholder.Line />
                                </Placeholder>
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}