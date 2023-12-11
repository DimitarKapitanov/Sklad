import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface Props {
    name: string;
    placeholder: string;
    label?: string;
    type?: string;
}

export default function MyTextInput(props: Props) {
    const [field, meta] = useField(props.name);

    return (
        <Form.Field className='ui grid' style={{ flex: 1, flexFlow: 'column', height: '75px' }} error={meta.touched && !!meta.error}>
        <label>{props.label}</label>
        <input {...field} {...props} style={meta.touched && meta.error ? { borderColor: 'red' } : {}} />
        {meta.touched && meta.error ? (
            <Label basic color='red' style={{ marginTop: 5, }}>{meta.error}</Label>
        ) : null}
    </Form.Field>
    )
}