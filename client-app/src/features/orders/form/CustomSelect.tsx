import { useField } from 'formik';
import { observer } from 'mobx-react-lite';
import ReactSelect from 'react-select';
import { Form, Label } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

interface Props {
    name: string;
    placeholder: string;
    options: { value: string; label: string }[];
    isMulti?: boolean;
    onMenuScrollToBottom?: () => void;
}

export default observer(function CustomReactSelect({ name, options, isMulti = false, onMenuScrollToBottom, placeholder }: Props) {
    const { partnerStore } = useStore();
    const { selectPartner } = partnerStore;
    const [field, meta, helpers] = useField(name);

    return (
        <>
            <Form.Field className="ui grid"
                style={{ flex: 1, flexFlow: "column" }}
                error={meta.touched && !!meta.error}>
                <ReactSelect
                    isClearable
                    placeholder={placeholder}
                    isMulti={isMulti}
                    options={options}
                    name={field.name}
                    value={options ? options.find(option => option.value === field.value) : ''}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(option: any) => {
                        helpers.setValue(option ? option.value : null);
                        selectPartner(option ? option.value : undefined);
                    }}
                    onBlur={() => helpers.setTouched(true)}
                    onMenuScrollToBottom={onMenuScrollToBottom}
                />
                {meta.touched && meta.error ? (
                    <Label basic color="red" style={{ marginTop: 5, marginLeft: "1rem", marginRight: "1rem" }}>{meta.error}</Label>
                ) : null}
            </Form.Field>
        </>
    );
});