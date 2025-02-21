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
    // TODO - move to service class
    if (updatedFilterModel.items.length === 0) {
        return {}
    } else if (!updatedFilterModel.items[0].value) {
        return {}
    }
    const filterItem = updatedFilterModel.items[0]
    const column = columns.find(column => column.field === filterItem.field)
    console.log(column)
    switch (column.type) {
        case 'date':
            console.log('DATE FILTER: ', formatDateFilter(filterItem))
            return formatDateFilter(filterItem)
        // case 'boolean':
        //     return {[filterItem.field]: !!filterItem.value}
        default:
            console.log('DEFAULT FILTER: ', {[filterItem.field]: filterItem.value})
            return {[filterItem.field]: filterItem.value}
    }
    // if (column.type === 'boolean' && typeof filterItem.value !== 'boolean') {
    //     filterItem.value = !!filterItem.value
    // }

}

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

function formatDate(date) {
    return date.toLocaleDateString('en-CA');
}