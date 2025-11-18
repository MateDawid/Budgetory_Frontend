import React, { useContext, useEffect, useState } from 'react';
import FormModal from '../../../app_infrastructure/components/FormModal/FormModal';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';
import { IconButton, InputAdornment } from '@mui/material';
import TransferTypes from '../../utils/TransferTypes';
import CategoryTypes from '../../../categories/utils/CategoryTypes';
import EntityAddModal from '../../../entities/components/EntityAddModal';
import AddIcon from '@mui/icons-material/Add';

/**
 * BaseTransferModal component for displaying Transfer form for adding and editing.
 * @param {object} props
 * @param {number} props.transferType - Type of Transfer. Options: TransferTypes.INCOME, TransferTypes.EXPENSE.
 * @param {boolean} props.formOpen - Flag indicating if form is opened or not.
 * @param {function} props.setFormOpen - Setter for formOpen flag.
 * @param {function} props.callApi - Function to be called on form submit.
 * @param {object | undefined} [props.editedTransfer] - Edited Transfer object.
 */
export default function BaseTransferModal({
  transferType,
  formOpen,
  setFormOpen,
  callApi,
  editedTransfer = undefined,
}) {
  const { contextBudgetId, contextBudgetCurrency, refreshTimestamp } =
    useContext(BudgetContext);

  // Selectables
  const [categories, setCategories] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [entities, setEntities] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  // Entity add form variables
  const entityApiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/`;
  const [entityFormOpen, setEntityFormOpen] = useState(false);
  const [entityAdded, setEntityAdded] = useState(0);

  const fields = {
    date: {
      type: 'date',
      label: 'Date',
      required: true,
    },
    name: {
      type: 'string',
      label: 'Name',
    },
    deposit: {
      type: 'select',
      select: true,
      label: `Deposit ${transferType === TransferTypes.EXPENSE ? 'from which funds are transferred' : 'into which funds are transferred'}`,
      required: true,
      options: deposits,
      groupBy: (option) => option.deposit_type_display,
      onChange: (value) => setSelectedDeposit(value),
      clearFieldsOnChange: ['category'],
    },
    category: {
      type: 'select',
      select: true,
      label: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} Category`,
      options: categories,
      groupBy: (option) => option.priority_display,
      disabled: !selectedDeposit,
    },
    entity: {
      type: 'select',
      select: true,
      label: `Entity ${transferType === TransferTypes.EXPENSE ? 'that receives funds from Deposit' : 'that transfers funds to Deposit'}`,
      options: entities,
      groupBy: (option) => (option.is_deposit ? 'Deposits' : 'Entities'),
      slotProps: {
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setEntityFormOpen(true)}
                edge="end"
                size="small"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      },
    },
    value: {
      type: 'number',
      step: 'any',
      label: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} value`,
      required: true,
      slotProps: {
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {contextBudgetCurrency}
            </InputAdornment>
          ),
        },
        htmlInput: {
          step: 0.01,
          min: 0,
        },
      },
    },
    description: {
      type: 'string',
      label: 'Description',
      multiline: true,
      rows: 4,
    },
  };

  /**
   * Updates selectedDeposit state depending on passed transfer.
   */
  useEffect(() => {
    if (editedTransfer) setSelectedDeposit(editedTransfer.deposit);
    else setSelectedDeposit(null);
  }, [editedTransfer]);

  /**
   * Fetches select options for Transfer deposits objects from API.
   */
  useEffect(() => {
    async function getDeposits() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/?ordering=deposit_type,name`
      );
      setDeposits(response);
    }
    if (!contextBudgetId) {
      return;
    }
    getDeposits();
  }, [contextBudgetId, refreshTimestamp]);

  /**
   * Fetches select options for Transfer entities objects from API.
   */
  useEffect(() => {
    async function getEntities() {
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=-is_deposit,name`
      );
      setEntities(response);
    }
    if (!contextBudgetId) {
      return;
    }
    getEntities();
  }, [contextBudgetId, refreshTimestamp, entityAdded]);

  /**
   * Fetches select options for Transfer categories object from API.
   */
  useEffect(() => {
    async function getCategories() {
      const filterModel = {
        category_type:
          transferType === TransferTypes.EXPENSE
            ? CategoryTypes.EXPENSE
            : CategoryTypes.INCOME,
        ordering: 'priority',
      };
      if (selectedDeposit) {
        filterModel['deposit'] = selectedDeposit;
      }
      const response = await getApiObjectsList(
        `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`,
        {},
        {},
        filterModel
      );
      setCategories(response);
    }
    if (!contextBudgetId) {
      return;
    }
    getCategories();
  }, [contextBudgetId, selectedDeposit]);

  return (
    <>
      <FormModal
        fields={fields}
        formLabel={`${editedTransfer ? 'Edit' : 'Add'} ${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'}`}
        open={formOpen}
        setOpen={setFormOpen}
        callApi={callApi}
        updatedObject={editedTransfer}
      />
      <EntityAddModal
        apiUrl={entityApiUrl}
        formOpen={entityFormOpen}
        setFormOpen={setEntityFormOpen}
        onSuccess={() => setEntityAdded(Date.now())}
      />
    </>
  );
}
