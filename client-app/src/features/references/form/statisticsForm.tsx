import { Formik, Form } from "formik";
import { Filters } from "../../../app/models/statistics";
import FilterForm from "./filterForm";
import { Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

interface Props {
    setIsSubmitted: (option: boolean) => void;
    setFilters: (filters: Filters) => void;
    onSubmit: (values: Filters) => void;
}

export default function StatisticsFilterForm(props: Props) {
    const { setIsSubmitted, setFilters, onSubmit } = props;
    const { commonStore } = useStore();

    const handleChange = (values: Filters): Filters => {
        const modifiedValues: Filters = { ...values };
        modifiedValues.startDate = values.startDate.toString().substring(0, 15);
        modifiedValues.endDate = values.endDate.toString().substring(0, 10);
        return modifiedValues;
    };

    return (
        <Formik
            initialValues={{
                filter: '',
                startDate: new Date(Date.now() - 7200000).toISOString().substring(0, 10),
                endDate: new Date(Date.now() - 3600000).toISOString().substring(0, 10),
            }}
            validationSchema={commonStore.validationSchemaStatistics}
            onSubmit={(values, actions) => {
                const newValues = handleChange(values);
                onSubmit(newValues);
                actions.resetForm({
                    values: {
                        filter: values.filter,
                        startDate: values.startDate,
                        endDate: values.endDate,
                    },
                });
            }}
        >
            {({ dirty, isValid, isSubmitting, setFieldValue }) => (
                <Segment>
                    <Form className="ui form" autoComplete="off">
                        <FilterForm
                            setFilters={setFilters}
                            setIsSubmitted={setIsSubmitted}
                            setFieldValue={setFieldValue}
                            formStatus={{ isSubmitting, isValid, dirty }}
                        />
                    </Form>
                </Segment>
            )}
        </Formik>
    );
}