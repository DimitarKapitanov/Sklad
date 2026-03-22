import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
interface Props {
  header: { key: string; label: string }[];
  children?: React.ReactNode;
}

const DataTable = (props: Props) => {
  return (
    <Table
      celled
      selectable
      className="product-table"
      unstackable
    >
      <TableHeader>
        <TableRow>
          {props.header.map((header) => (
            <TableHeaderCell key={header.key} className="groupe-product">{header.label}</TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>{props.children}</TableBody>
    </Table>
  );
};

export default DataTable;
