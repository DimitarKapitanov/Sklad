import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  min?: number;
  max?: number;
  currentValue?: number;
  label?: string;
  type?: string;
  value?: string | number;
  step?: string;
  readonly?: boolean;
  disabled?: boolean;
  onChange?: (data: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MyTextInput(props: Props) {
  const [field, meta] = useField(props.name);

  return (
    <Form.Field
      className="ui grid"
      style={{ flex: 1, flexFlow: "column" }}
      error={meta.touched && !!meta.error}
    >
      {props.label && <label>{props.label}</label>}
      <input
        {...field}
        name={props.name}
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        step={props.step}
        readOnly={props.readonly}
        disabled={props.disabled}
        onChange={(data) => {
          if (props.min !== null && props.min !== undefined && Number(data.target.value) < props.min) data.target.value = props.min.toString();
          if (props.max && Number(data.target.value) > props.max) data.target.value = props.max.toString();
          field.onChange(data);
          if (props.onChange) props.onChange(data);
        }}
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
