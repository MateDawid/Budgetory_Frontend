import React, { useContext, useEffect, useState } from "react";
import FormModal from "../../../app_infrastructure/components/FormModal/FormModal";
import { AlertContext } from "../../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import { createApiObject, getApiObjectsList } from "../../../app_infrastructure/services/APIService";
import { InputAdornment } from "@mui/material";
import TransferTypes from "../../utils/TransferTypes";
import CategoryTypes from "../../../categories/utils/CategoryTypes";

export default function TransferAddModal({ apiUrl, transferType, addFormOpen, setAddFormOpen }) {
    const { contextBudgetId, contextBudgetCurrency, updateRefreshTimestamp } = useContext(BudgetContext);
    const { setAlert } = useContext(AlertContext);
    const [periods, setPeriods] = useState([])
    const [categories, setCategories] = useState([])
    const [deposits, setDeposits] = useState([])
    const [entities, setEntities] = useState([])
    const [selectedDeposit, setSelectedDeposit] = useState(null);

    const fields = {
        date: {
            type: 'date',
            label: 'Date',
            required: true,
        },
        period: {
            type: 'select',
            select: true,
            label: 'Period',
            required: true,
            options: periods
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
            clearFieldsOnChange: ['category']
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
            required: true,
            options: entities,
            groupBy: (option) => option.is_deposit ? 'Deposits' : 'Entities'
        },
        value: {
            type: 'number',
            step: "any",
            label: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} value`,
            required: true,
            slotProps: {
                input: { endAdornment: <InputAdornment position="end">{contextBudgetCurrency}</InputAdornment> },
                htmlInput: {
                    step: 0.01,
                    min: 0
                }
            }
        },
        description: {
            type: 'string',
            label: 'Description',
            multiline: true,
            rows: 4
        }
    }

    useEffect(() => {
        async function getPeriodsChoices() {
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`)
                setPeriods(response);
            } catch (err) {
                setPeriods([])
            }
        }
        async function getDeposits() {
            const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/?ordering=deposit_type,name`)
            setDeposits(response);
        }
        async function getEntities() {
            const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/?ordering=-is_deposit,name`)
            setEntities(response);
        }
        if (!contextBudgetId) {
            return
        }
        getPeriodsChoices();
        getDeposits();
        getEntities();
    }, [contextBudgetId]);

    /**
     * Fetches select options for ExpensePrediction categories object from API.
     */
    useEffect(() => {
        async function getCategories() {
            const filterModel = { 
                category_type: transferType === TransferTypes.EXPENSE ? CategoryTypes.EXPENSE : CategoryTypes.INCOME,
                ordering: 'priority'
             }
            if (selectedDeposit) {
                filterModel['deposit'] = selectedDeposit
            }
            const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/`, {}, {}, filterModel)
            setCategories(response);
        }
        if (!contextBudgetId) {
            return
        }
        getCategories();
    }, [contextBudgetId, selectedDeposit]);

    const callApiOnAdd = async (data) => {
        const updateResponse = await createApiObject(apiUrl, data);
        updateRefreshTimestamp();
        setAlert({ type: 'success', message: `${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'} created successfully.` })
        return updateResponse
    }

    return (<FormModal
        fields={fields}
        objectType={`New ${transferType === TransferTypes.EXPENSE ? 'Expense' : 'Income'}`}
        open={addFormOpen}
        setOpen={setAddFormOpen}
        callApi={callApiOnAdd}
    />
    )
}