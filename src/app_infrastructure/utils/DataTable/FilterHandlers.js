import {
    getGridDateOperators,
    getGridStringOperators,
    getGridNumericOperators,
    getGridBooleanOperators,
    getGridSingleSelectOperators
} from "@mui/x-data-grid";

/**
 * Mapping of DataGrid columns types with supported filter methods.
 */
export const mappedFilterOperators = {
    'string': getGridStringOperators().filter(operator => ['contains'].includes(operator.value)),
    'date': getGridDateOperators().filter(operator => ['is', 'before', 'onOrBefore', 'after', 'onOrAfter'].includes(operator.value)),
    'dateTime': getGridDateOperators(true).filter(operator => ['is', 'before', 'onOrBefore', 'after', 'onOrAfter'].includes(operator.value)),
    'number': getGridNumericOperators(),
    'boolean': getGridBooleanOperators(),
    'singleSelect': getGridSingleSelectOperators()
}

/**
 * Function for formatting filterModel for API calls purposes.
 * @param {object} updatedFilterModel - Updated filterModel returned from DataGrid after update.
 * @param {object} columns - Displayed columns settings.
 * @return {object} - Formatted filterModel for DataGrid.
 */
export function formatFilterModel(updatedFilterModel, columns) {
    if (updatedFilterModel.items.length === 0) {
        return {}
    } else if (updatedFilterModel.items[0].value == null) {
        return {}
    }
    const filterItem = updatedFilterModel.items[0]
    const column = columns.find(column => column.field === filterItem.field)
    switch (column.type) {
        case 'date':
            return formatDateFilter(filterItem)
        default:
            return {[filterItem.field]: filterItem.value}
    }
}

/**
 * Function for formatting date filter for API calls purposes.
 * @param {object} filterItem - Filter definition received from DataGrid
 * @return {object} - Formatted filterModel with date filter for DataGrid.
 */
function formatDateFilter(filterItem) {
    switch (filterItem.operator) {
        case 'is':
            return {
                [`${filterItem.field}_after`]: formatDate(filterItem.value),
                [`${filterItem.field}_before`]: formatDate(filterItem.value)
            };
        case 'before': {
            let dayBefore = new Date(filterItem.value);
            dayBefore.setDate(dayBefore.getDate() - 1);
            return {[`${filterItem.field}_before`]: formatDate(dayBefore)};
        }
        case 'onOrBefore':
            return {[`${filterItem.field}_before`]: formatDate(filterItem.value)};
        case 'after': {
            let dayAfter = new Date(filterItem.value);
            dayAfter.setDate(dayAfter.getDate() + 1);
            return {[`${filterItem.field}_after`]: formatDate(dayAfter)};
        }
        case 'onOrAfter':
            return {[`${filterItem.field}_after`]: formatDate(filterItem.value)};
        default:
            return {[filterItem.field]: filterItem.value};
    }
}

/**
 * Function for formatting Date object into string in format YYYY-MM-DD
 * @param {Date} date - Filter definition received from DataGrid
 * @return {string} - Formatted filterModel with date filter for DataGrid.
 */
function formatDate(date) {
    // TODO - use it in all places where formatting appears
    return date.toLocaleDateString('en-CA');
}