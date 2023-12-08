import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";

export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [field, meta, helpers] = useField(props.name!);

    return (
        <Form.Field className='ui grid' style={{ flex: 1, flexFlow: 'column', height: '75px' }} error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
                onBlur={() => helpers.setTouched(true)}
                onChangeRaw={(e) => e.preventDefault()}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red' style={{ marginTop: 5, }}>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}