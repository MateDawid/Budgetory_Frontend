import { getApiObjectsList } from '../../app_infrastructure/services/APIService';

/**
 * Loads select options for TransferCategory object.
 * @param {number} contextWalletId - Context Wallet id.
 * @param {function} setTypeOptions - Setter for "category_type" field options.
 * @param {function} setPriorityOptions - Setter for "priority" field options.
 * @param {function} setDepositOptions - Setter for "deposit" field options.
 * @param {function} setAlert - Setter for context Alert.
 */
const loadSelectOptionForCategory = async (
  contextWalletId,
  setTypeOptions,
  setPriorityOptions,
  setDepositOptions,
  setAlert
) => {
  try {
    const typeResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/categories/types`
    );
    setTypeOptions(typeResponse.results);
    const priorityResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/categories/priorities`
    );
    setPriorityOptions(priorityResponse.results);
    const depositResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits`
    );
    setDepositOptions(depositResponse);
  } catch (err) {
    console.error(err);
    setAlert({ type: 'error', message: 'Failed to load select options.' });
  }
};

export default loadSelectOptionForCategory;
