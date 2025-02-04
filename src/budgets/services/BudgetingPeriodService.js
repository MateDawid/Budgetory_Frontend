import {getAccessToken} from "../../app_users/services/LoginService";

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

// /**
//  * Function to get details of single Budget.
//  * @param {string} budgetId - id of Budget object.
//  * @return {object} - JSON data with API response.
//  */
// export const getBudgetDetail = async (budgetId) => {
//     const token = await getAccessToken()
//     const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}`
//     const response = await fetch(url, {method: "GET", headers: {Authorization: `Bearer ${token}`}})
//     return await response.json();
// };
//
// /**
//  * Function to create Budget.
//  * @param {object} budgetData - Created Budget data.
//  * @return {object} - JSON data with API response.
//  */
// export const createBudget = async (budgetData) => {
//         try {
//             const token = await getAccessToken()
//             const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/`
//             const requestOptions = {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(budgetData)
//             }
//             const response = await fetch(url, requestOptions)
//             if (!response.ok) {
//                 const data = await response.json()
//                 return {errorOccurred: true, ...data}
//             }
//             return await response.json();
//         } catch (error) {
//             return {errorOccurred: true, detail: {serverError: "Unexpected error occurred."}}
//         }
//     }
// ;
//
// /**
//  * Function to update single Budget.
//  * @param {string} budgetId - id of Budget object.
//  * @param {string} apiFieldName - API field name for field value.
//  * @param {object} newValue - New value for updated field.
//  * @return {object} - JSON data with API response.
//  */
// export const updateBudget = async (budgetId, apiFieldName, newValue) => {
//     let dataErrorRaised = false
//     try {
//         const token = await getAccessToken()
//         const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}/`
//         const requestOptions = {
//             method: "PATCH",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({[apiFieldName]: newValue})
//         }
//         const response = await fetch(url, requestOptions)
//         if (!response.ok) {
//             const data = await response.json()
//             dataErrorRaised = true
//             throw new Error(data.detail[apiFieldName][0]);
//         }
//         return await response.json();
//     }
//     catch (error) {
//         if (dataErrorRaised) {
//             throw error;
//         } else {
//             throw new Error("Unexpected error occurred.");
//         }
//
//     }
// };
//
//
// /**
//  * Function to delete single Budget.
//  * @param {string} budgetId - id of Budget object.
//  * @return {object} - JSON data with API response.
//  */
// export const deleteBudget = async (budgetId) => {
//     try {
//         const token = await getAccessToken()
//         const url = `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${budgetId}/`
//         const requestOptions = {
//             method: "DELETE",
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//                 "Content-Type": "application/json",
//             }
//         }
//         const response = await fetch(url, requestOptions)
//         if (!response.ok) {
//             const data = await response.json()
//             return {errorOccurred: true, ...data}
//         }
//         return {errorOccurred: false, detail: "Success."};
//     } catch (error) {
//         return {errorOccurred: true, detail: "Unexpected server error."}
//     }
// };
