import React, { useContext } from "react";
import FormModal from "../../../app_infrastructure/components/FormModal/FormModal";
import { AlertContext } from "../../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";
import { updateApiObject } from "../../../app_infrastructure/services/APIService";

/**
 * PredictionEditModal component to display edit form for Expense Prediction object.
 * @param {object} props
 * @param {object} props.prediction - Edited Expense Prediction.
 * @param {boolean} props.editOpen - Flag indicating if edit modal is opened.
 * @param {Function} props.setEditOpen - Setter for editOpen value.
 */
export default function PredictionEditModal({ prediction, editOpen, setEditOpen }) {
    const { contextBudgetId, updateRefreshTimestamp } = useContext(BudgetContext);
    const { setAlert } = useContext(AlertContext);

    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`

    const fields = {
        period: {
            prefixedValue: prediction.period
        },
        category: {
            type: 'select',
            select: true,
            label: 'Category',
            required: true,
            options: [{
                value: prediction.category,
                label: prediction.category_display
            }]
        },
        current_plan: {
            type: 'number',
            step: "any",
            label: 'Value',
            required: true,
            slotProps: {
                htmlInput: {
                    step: 0.01,
                    min: 0
                }
            }
        },
        description: {
            type: 'string',
            label: 'Description',
            required: false,
            multiline: true,
            rows: 4
        }
    }

    /**
    * Function to handle editing object in API.
    * @param {object} data - Data collected from Edit form.
    * @returns {Promise<object>} - API response.
    */
    const callApiOnEdit = async (data) => {
        delete data.category
        data['id'] = prediction.id
        const updateResponse = await updateApiObject(apiUrl, data);
        updateRefreshTimestamp();
        setAlert({ type: 'success', message: `Prediction updated successfully.` })
        return updateResponse
    }

    return (<FormModal
        fields={fields}
        objectType={"Prediction edit"}
        open={editOpen}
        setOpen={setEditOpen}
        callApi={callApiOnEdit}
        setAlert={setAlert}
        updatedObject={prediction}
        disabledFields={['category']}
    />
    )
}