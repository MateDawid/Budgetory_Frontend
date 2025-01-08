import {getAccessToken} from "../../app_users/services/LoginService";

/**
 * Function to get list of User Budgets.
 * @param {object} paginationModel - paginationModel object with page number and page size.
 * @return {object} - JSON data with API response.
 */
export const getBudgetList = async (paginationModel) => {
    const token = await getAccessToken()
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/?` + new URLSearchParams({
        page: paginationModel.page + 1,
        page_size: paginationModel.pageSize
    });
    const response = await fetch(url, {method: "GET", headers: {Authorization: `Bearer ${token}`}})
    return await response.json();
};

/**
 * Function to get list of User Budgets.
 * @param {string} budgetId - id of Budget object.
 * @return {object} - JSON data with API response.
 */
export const getBudgetDetail = async (budgetId) => {
    const token = await getAccessToken()
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}`
    const response = await fetch(url, {method: "GET", headers: {Authorization: `Bearer ${token}`}})
    return await response.json();
};