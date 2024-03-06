import { useField } from "formik";
import { debounce } from 'lodash';
import { observer } from "mobx-react-lite";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
  name: string;
  placeholder: string;
  options: { text: string; value: string; key?: string }[];
  label?: string;
  size?: string;
  onSelected?: (option: {
    text: string;
    value: string;
    key?: string | undefined;
  }) => void;
  onChange?: (data: unknown) => void;
  search?: boolean;
  onSearchChange?: (e: React.SyntheticEvent<HTMLElement, Event>, data: { searchQuery: string }) => void;
}

export default observer(function MySelectInput(props: Props) {
  const [field, meta, helpers] = useField(props.name);

  return (
    <>
      <Form.Field
        className="ui grid"
        style={{ flex: 1, flexFlow: "column" }}
        error={meta.touched && !!meta.error}
      >
        <label>{props.label}</label>
        <Select
          clearable
          options={props.options}
          value={field.value || null}
          onChange={(_, d) => {
            helpers.setValue(d.value);
            const selectedOption = props.options.find(
              (option) => option.value === d.value
            );
            if (selectedOption && props.onSelected) {
              props.onSelected(selectedOption);
            }
            if (props.onChange) {
              props.onChange(d.value);
            }
          }}
          onBlur={() => helpers.setTouched(true)}
          placeholder={props.placeholder}
          search={props.search}
          onSearchChange={props.onSearchChange && debounce(props.onSearchChange, 500)}
        />
        {meta.touched && meta.error ? (
          <Label basic color="red" style={{ marginTop: 5 }}>
            {meta.error}
          </Label>
        ) : null}
      </Form.Field>
    </>
  );
});