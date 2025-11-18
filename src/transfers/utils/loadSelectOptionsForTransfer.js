import { getApiObjectsList } from '../../app_infrastructure/services/APIService';

/**
 * Loads select options for Transfer object.
 * @param {number} contextBudgetId - Context Budget id.
 * @param {number} categoryType - One of CategoryTypes choices
 * @param {function} setPeriodOptions - Setter for "period" field options.
 * @param {function} setEntityOptions - Setter for "entity" field options.
 * @param {function} setDepositOptions - Setter for "deposit" field options.
 * @param {function} setCategoryOptions - Setter for "category" field options.
 * @param {function} setAlert - Setter for context Alert.
 */
const loadSelectOptionsForTransfer = async (
  contextBudgetId,
  categoryType,
  setPeriodOptions,
  setEntityOptions,
  setDepositOptions,
  setCategoryOptions,
  setAlert
) => {
  try {
    const periodResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/periods/`
    );
    setPeriodOptions(periodResponse);
    const entityResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/entities/`
    );
    setEntityOptions(entityResponse);
    const depositResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`
    );
    setDepositOptions(depositResponse);
    const categoryResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/categories/?category_type=${categoryType}`
    );
    setCategoryOptions(categoryResponse);
  } catch (err) {
    console.error(err);
    setAlert({ type: 'error', message: 'Failed to load select options.' });
  }
};

export default loadSelectOptionsForTransfer;
