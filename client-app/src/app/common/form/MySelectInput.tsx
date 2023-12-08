import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
    name: string;
    placeholder: string;
    options: { text: string, value: string, key?: string }[];
    label?: string;
    onSelected?: (option: { text: string; value: string; key?: string | undefined; }) => void;
}

export default function MyTextInput(props: Props) {
    const [field, meta, helpers] = useField(props.name);

    return (
        <>
            <Form.Field className='ui grid' style={{ flex: 1, flexFlow: 'column', height: '75px' }} error={meta.touched && !!meta.error}>
                <label>{props.label}</label>
                <Select
                    clearable
                    options={props.options}
                    value={field.value || null}
                    onChange={(_, d) => {
                        helpers.setValue(d.value);
                        const selectedOption = props.options.find(option => option.value === d.value);
                        if (selectedOption && props.onSelected) {
                            props.onSelected(selectedOption);
                        }
                    }}
                    onBlur={() => helpers.setTouched(true)}
                    placeholder={props.placeholder}
                />
                {meta.touched && meta.error ? (
                    <Label basic color='red' style={{ marginTop: 5, }}>{meta.error}</Label>
                ) : null}
            </Form.Field>
        </>
    )
}