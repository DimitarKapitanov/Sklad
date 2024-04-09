import { useField } from 'formik';
import { observer } from 'mobx-react-lite';
import ReactSelect from 'react-select';
import { Form, Label } from 'semantic-ui-react';

interface Props {
    name: string;
    placeholder: string;
    options: { value: string; label: string }[];
    label?: string;
    onMenuScrollToBottom?: () => void;
    value?: { value: string; label: string } | null;
}

export default observer(function ProductSelect(prop: Props) {
    const [field, meta, helpers,] = useField(prop.name);

    return (
        <Form.Field className="ui grid"
            style={{ flex: 1, flexFlow: "column" }}
            error={meta.touched && !!meta.error}>
            <label
                className="custom-label"
                style={{ margin: "0 0 .28571429rem 0" }}
            >{prop.label}</label>
            <ReactSelect
                isClearable
                placeholder={prop.placeholder}
                options={prop.options}
                name={field.name}
                value={prop.value}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(option: any) =>
                    helpers.setValue(option ? option.value : null)}
                onBlur={() => helpers.setTouched(true)}
                onMenuScrollToBottom={prop.onMenuScrollToBottom}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red" style={{ marginTop: 5, marginLeft: "1rem", marginRight: "1rem" }}>{meta.error}</Label>
            ) : null}
        </Form.Field>
    );
});
