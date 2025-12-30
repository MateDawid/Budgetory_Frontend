import React from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';
import { EntityTypes } from '../EntityDataGrid';

/**
 * BaseEntityModal component for displaying Entity form for adding and editing.
 * @param {object} props
 * @param {number} props.entityType - Type of Entity (Entity or Deposit)
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} props.callApi - Function to be called on form submit.
 * @param {object | undefined} [props.editedEntity] - Edited Entity object.
 */
export default function BaseEntityModal({
  entityType,
  formOpen,
  setFormOpen,
  callApi,
  editedEntity = undefined,
}) {
  const fields = {
    name: {
      type: 'string',
      label: 'Name',
      autoFocus: true,
      required: true,
    },
    description: {
      type: 'string',
      label: 'Description',
      required: false,
      multiline: true,
      rows: 4,
    },
    is_active: {
      type: 'select',
      select: true,
      label: 'Status',
      defaultValue: editedEntity ? editedEntity.is_active : true,
      required: true,
      options: [
        {
          value: true,
          label: '🟢 Active',
        },
        {
          value: false,
          label: '🔴 Inactive',
        },
      ],
    },
  };

  return (
    <>
      <FormModal
        fields={fields}
        formLabel={`${editedEntity ? 'Edit' : 'Add'} ${entityType === EntityTypes.ENTITY ? 'Entity' : 'Deposit'}`}
        open={formOpen}
        setOpen={setFormOpen}
        callApi={callApi}
        updatedObject={editedEntity}
      />
    </>
  );
}
