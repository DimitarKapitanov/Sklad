import { Button, FormGroup } from "semantic-ui-react";
import { useState } from "react";
import { filterStatisticsOptions } from "../../../app/common/options/filterStatisticsOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { Filters } from "../../../app/models/statistics";

interface Props {
  setFilters: (filters: Filters) => void;
  setIsSubmitted: (option: boolean) => void;
  setFieldValue: (field: string, value: string | Date) => void;
  formStatus: { isSubmitting: boolean; isValid: boolean; dirty: boolean };
}

export default function FilterForm(props: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  function handleFilter(
    option: { text: string; value: string },
    setFieldValue: (field: string, value: string | Date) => void
  ) {
    if (selectedFilter !== option.value) {
      props.setIsSubmitted(false);
    }

    const startDate = new Date(Date.now() - 7200000)
      .toISOString()
      .substring(0, 10);
    const endDate = new Date(Date.now() - 3600000)
      .toISOString()
      .substring(0, 10);

    setFieldValue("filter", option.value);
    setFieldValue("startDate", startDate);
    setFieldValue("endDate", endDate);
    setSelectedFilter(option.value);

    props.setFilters({
      filter: option.value,
      startDate: startDate,
      endDate: endDate,
    });
  }

  return (
    <FormGroup inline className="actions-inputs">
      <MySelectInput
        onSelected={(e) => handleFilter(e, props.setFieldValue)}
        options={filterStatisticsOptions}
        placeholder={selectedFilter || "Изберете статистика"}
        label="Филтри за статистика"
        name="Statistics"
      />
      {selectedFilter && selectedFilter !== "Налични продукти" ? (
        <>
          Начална дата: <MyDateInput name="startDate" />
          Крайна дата: <MyDateInput name="endDate" />
          <Button
            type="submit"
            disabled={
              props.formStatus.isSubmitting ||
              !props.formStatus.dirty ||
              !props.formStatus.isValid
            }
            positive
            onClick={() => props.setIsSubmitted(true)}
          >
            Изпрати
          </Button>
        </>
      ) : (
        ""
      )}
    </FormGroup>
  );
}
