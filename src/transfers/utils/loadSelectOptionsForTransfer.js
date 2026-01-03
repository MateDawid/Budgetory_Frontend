import { getApiObjectsList } from '../../app_infrastructure/services/APIService';

/**
 * Loads select options for Transfer object.
 * @param {number} contextWalletId - Context Wallet id.
 * @param {number} categoryType - One of CategoryTypes choices
 * @param {function} setPeriodOptions - Setter for "period" field options.
 * @param {function} setEntityOptions - Setter for "entity" field options.
 * @param {function} setDepositOptions - Setter for "deposit" field options.
 * @param {function} setCategoryOptions - Setter for "category" field options.
 * @param {function} setAlert - Setter for context Alert.
 */
const loadSelectOptionsForTransfer = async (
  contextWalletId,
  categoryType,
  setPeriodOptions,
  setEntityOptions,
  setDepositOptions,
  setCategoryOptions,
  setAlert
) => {
  try {
    const periodResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/periods/`
    );
    setPeriodOptions(periodResponse);
    const entityResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/entities/`
    );
    setEntityOptions(entityResponse);
    const depositResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/deposits/`
    );
    setDepositOptions(depositResponse);
    const categoryResponse = await getApiObjectsList(
      `${process.env.REACT_APP_BACKEND_URL}/api/wallets/${contextWalletId}/categories/?category_type=${categoryType}`
    );
    setCategoryOptions(categoryResponse);
  } catch (err) {
    console.error(err);
    setAlert({ type: 'error', message: 'Failed to load select options.' });
  }
};

export default loadSelectOptionsForTransfer;
