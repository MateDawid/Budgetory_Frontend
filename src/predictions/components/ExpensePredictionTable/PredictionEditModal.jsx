import React, { useContext } from "react";
import FormModal from "../../../app_infrastructure/components/FormModal/FormModal";
import { AlertContext } from "../../../app_infrastructure/store/AlertContext";
import { BudgetContext } from "../../../app_infrastructure/store/BudgetContext";

export default function PredictionDeleteModal({ predictionId, deleteOpen, setDeleteOpen }) {
    const { contextBudgetId, updateRefreshTimestamp } = useContext(BudgetContext);
    const { setAlert } = useContext(AlertContext);

    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/expense_predictions/`

    return (<FormModal
        fields={updateFields}
        objectType={"Prediction edit"}
        open={editFormOpen}
        setOpen={setEditFormOpen}
        callApi={callApiOnEdit}
        setAlert={setAlert}
        updatedObject={prediction}
        disabledFields={['category']}
    />
    )