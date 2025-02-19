/**
 * Function for converting Date object to string in format YYYY-MM-DD.
 * @param {object} apiInput - DataGrid row.
 * @param {object} columns - DataGrid columns.
 * @return {object} - Formatted DataGrid row.
 */
export function prepareApiInput(apiInput, columns) {
    Object.keys(apiInput).forEach(key => {
        const column = columns.find(column => column.field === key)
        if (!column) {
            return;
        }
        if (column.type === 'date' && apiInput[key] instanceof Date) {
            apiInput[key] = apiInput[key].toLocaleDateString('en-CA');
        }
        else if (column.type === 'boolean' && typeof apiInput[key] !== 'boolean'){
            apiInput[key] = !!apiInput[key]
        }
    });
    return apiInput
}