import React from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';

/**
 * BasePeriodModal component for displaying BudgetingPeriod form for adding and editing.
 * @param {object} props
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} props.callApi - Function to be called on form submit.
 * @param {object | undefined} [props.editedPeriod] - Edited BudgetingPeriod object.
 */
export default function BasePeriodModal({
  formOpen,
  setFormOpen,
  callApi,
  editedPeriod = undefined,
}) {
  const fields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    date_start: {
      type: 'date',
      label: 'Date start',
      required: true,
    },
    date_end: {
      type: 'date',
      label: 'Date end',
      required: true,
    },
  };

  return (
    <FormModal
      fields={fields}
      formLabel={`${editedPeriod ? 'Edit' : 'Add'} Period`}
      open={formOpen}
      setOpen={setFormOpen}
      callApi={callApi}
      updatedObject={editedPeriod}
    />
  );
}
