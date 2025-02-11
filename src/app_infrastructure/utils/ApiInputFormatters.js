/**
 * Function for converting Date object to string in format YYYY-MM-DD.
 * @param {Date} date - Date object.
 * @return {string} - Date object converted to string in format YYYY-MM-DD.
 */
export function convertDateToApiFormat(date) {
    return date.toLocaleDateString('en-CA');
}

/**
 * Function for converting Date object to string in format YYYY-MM-DD.
 * @param {object} apiInput - DataGrid row.
 * @return {object} - Formatted DataGrid row.
 */
export function prepareApiInput(apiInput) {
    Object.keys(apiInput).forEach(key => {
        if (apiInput[key] instanceof Date) {
            apiInput[key] = convertDateToApiFormat(apiInput[key])
        }
    });
    return apiInput
}