import {getAccessToken} from "../../app_users/services/LoginService";
import ApiError from "../../app_infrastructure/utils/ApiError";

/**
 * Function to get list of Budget BudgetingPeriods.
 * @param {string} budgetId - id of Budget object.
 * @param {object} paginationModel - paginationModel object with page number and page size.
 * @return {object} - JSON data with API response.
 */
export const getBudgetingPeriodList = async (budgetId, paginationModel) => {
    const token = await getAccessToken()
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}/periods/?` + new URLSearchParams({
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize
    });
    const response = await fetch(url, {method: "GET", headers: {Authorization: `Bearer ${token}`}})
    return await response.json();
};

/**
 * Function to create BudgetingPeriod.
 * @param {string} budgetId - id of Budget object.
 * @param {object} newObject - Payload for API call with new object values.
 * @return {object} - JSON data with API response.
 */
export const createBudgetingPeriod = async (budgetId, newObject) => {
    let dataErrorRaised = false
    try {
        const token = await getAccessToken()
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}/periods/`
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newObject)
        }
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            const data = await response.json()
            dataErrorRaised = true
            throw new ApiError('Invalid data', data);
        }
        return await response.json();
    }
    catch (error) {
        if (dataErrorRaised) {
            throw error;
        } else {
            throw new Error("Unexpected error occurred.");
        }

    }
};

/**
 * Function to update single BudgetingPeriod.
 * @param {string} budgetId - id of Budget object.
 * @param {object} updatedObject - Payload for API call with updated object values.
 * @return {object} - JSON data with API response.
 */
export const updateBudgetingPeriod = async (budgetId, updatedObject) => {
    let dataErrorRaised = false
    try {
        const token = await getAccessToken()
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}/periods/${updatedObject["id"]}/`
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedObject)
        }
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            const data = await response.json()
            dataErrorRaised = true
            throw new ApiError('Invalid data', data);
        }
        return await response.json();
    }
    catch (error) {
        if (dataErrorRaised) {
            throw error;
        } else {
            throw new Error("Unexpected error occurred.");
        }

    }
};


/**
 * Function to delete single BudgetingPeriod.
 * @param {string} budgetId - id of Budget object.
 * @param {string} periodId - id of BudgetingPeriod object.
 * @return {object} - JSON data with API response.
 */
export const deleteBudgetingPeriod = async (budgetId, periodId) => {
    try {
        const token = await getAccessToken()
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}/periods/${periodId}/`
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            const data = await response.json()
            return {errorOccurred: true, ...data}
        }
        return {errorOccurred: false, detail: "Success."};
    } catch (error) {
        return {errorOccurred: true, detail: "Unexpected server error."}
    }
};
