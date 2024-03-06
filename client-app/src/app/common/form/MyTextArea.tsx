import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  rows: number;
  label?: string;
  value?: string;
}

export default function MyTextArea(props: Props) {
  const [field, meta] = useField(props.name);

  return (
    <Form.Field
      className="ui grid"
      style={{ flex: 1, flexFlow: "column" }}
      error={meta.touched && !!meta.error}
    >
      <label>{props.label}</label>
      <textarea
        {...field}
        {...props}
        style={meta.touched && meta.error ? { borderColor: "red" } : {}}
      />
      {meta.touched && meta.error ? (
        <Label basic color="red" style={{ marginTop: 5 }}>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}
