import {getApiObjectsList} from "../../app_infrastructure/services/APIService";

/**
 * Loads select options for TransferCategory object.
 * @param {number} contextBudgetId - Context Budget id.
 * @param {function} setTypeOptions - Setter for "category_type" field options.
 * @param {function} setPriorityOptions - Setter for "priority" field options.
 * @param {function} setOwnerOptions - Setter for "owner" field options.
 * @param {function} setAlert - Setter for context Alert.
 */
const loadSelectOptionForCategory = async (contextBudgetId, setTypeOptions, setPriorityOptions, setOwnerOptions, setAlert) => {
    try {
        const typeResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/categories/types`)
        setTypeOptions(typeResponse.results);
        const priorityResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`)
        setPriorityOptions(priorityResponse.results);
        const ownerResponse = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/members/`)
        setOwnerOptions([{value: -1, label: '🏦 Common'}, ...ownerResponse]);
    } catch (err) {
        console.error(err)
        setAlert({type: 'error', message: "Failed to load select options."});
    }
}

export default loadSelectOptionForCategory;