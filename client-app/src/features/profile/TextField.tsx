import { observer } from "mobx-react-lite"

interface Props {
    name?: string;
    value: string;
    label?: string;
    bigger?: boolean;
    rows?: number;
}

export default observer(function TextField(props: Props) {
    return (
        <div className="custom-text-field">
            {
                (props.label && props.name) && <label htmlFor={props.name}>{props.label}</label>
            }
            {
                props.bigger ?
                    <textarea readOnly={true} name={props.name} id={props.name} value={props.value} rows={props.rows} style={{ resize: 'none' }} />
                    :
                    <input readOnly={true} name={props.name} id={props.name} value={props.value} />
            }
        </div>
    )
})