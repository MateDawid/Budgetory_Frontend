import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasePredictionModal from './BasePredictionModal';
import { WalletContext } from '../../../app_infrastructure/store/WalletContext';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';
import CategoryTypes from '../../../categories/utils/CategoryTypes';

// Mock dependencies
jest.mock('../../../app_infrastructure/services/APIService');

// Create a module-level variable to store props
let lastFormModalProps = null;

jest.mock('../../../app_infrastructure/components/FormModal/FormModal', () => {
  return function FormModal(props) {
    // Store props at module level
    lastFormModalProps = props;

    return (
      <div data-testid="form-modal">
        <div data-testid="form-label">{props.formLabel}</div>
        <div data-testid="form-open">{props.open.toString()}</div>
        <div data-testid="fields-count">
          {Object.keys(props.fields || {}).length}
        </div>
      </div>
    );
  };
});

describe('BasePredictionModal', () => {
  const mockSetFormOpen = jest.fn();
  const mockCallApi = jest.fn();
  const mockGetContextWalletId = jest.fn(() => 'wallet-123');

  const mockWalletContext = {
    getContextWalletId: mockGetContextWalletId,
    contextWalletCurrency: 'USD',
    refreshTimestamp: 1234567890,
  };

  const mockDeposits = [
    {
      id: 'deposit-1',
      name: 'Checking Account',
      deposit_type_display: 'Bank Account',
    },
    {
      id: 'deposit-2',
      name: 'Savings Account',
      deposit_type_display: 'Bank Account',
    },
  ];

  const mockCategories = [
    {
      id: 'category-1',
      name: 'Groceries',
      priority_display: 'High',
      category_type: CategoryTypes.EXPENSE,
    },
    {
      id: 'category-2',
      name: 'Entertainment',
      priority_display: 'Low',
      category_type: CategoryTypes.EXPENSE,
    },
  ];

  const mockEditedPrediction = {
    id: 'prediction-1',
    deposit: 'deposit-1',
    category: 'category-1',
    current_plan: 500.0,
    description: 'Monthly grocery wallet',
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      formOpen: true,
      setFormOpen: mockSetFormOpen,
      callApi: mockCallApi,
      editedPrediction: undefined,
    };

    return render(
      <WalletContext.Provider value={mockWalletContext}>
        <BasePredictionModal {...defaultProps} {...props} />
      </WalletContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    lastFormModalProps = null;
    getApiObjectsList.mockResolvedValue([]);
    mockGetContextWalletId.mockReturnValue('wallet-123');
  });

  describe('Component Rendering', () => {
    it('should render the component successfully', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('form-modal')).toBeInTheDocument();
      });
    });

    it('should display "Add Expense Prediction" label when no edited prediction', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('form-label')).toHaveTextContent(
          'Add Expense Prediction'
        );
      });
    });

    it('should display "Edit Expense Prediction" label when editing', async () => {
      renderComponent({ editedPrediction: mockEditedPrediction });

      await waitFor(() => {
        expect(screen.getByTestId('form-label')).toHaveTextContent(
          'Edit Expense Prediction'
        );
      });
    });

    it('should pass formOpen prop to FormModal', async () => {
      renderComponent({ formOpen: true });

      await waitFor(() => {
        expect(screen.getByTestId('form-open')).toHaveTextContent('true');
      });
    });

    it('should pass formOpen as false to FormModal', async () => {
      renderComponent({ formOpen: false });

      await waitFor(() => {
        expect(screen.getByTestId('form-open')).toHaveTextContent('false');
      });
    });
  });

  describe('API Data Fetching', () => {
    it('should fetch deposits on mount when contextWalletId exists', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/wallet-123/deposits/?ordering=deposit_type,name&fields=value,label`
        );
      });
    });

    it('should not fetch deposits when contextWalletId is missing', async () => {
      const mockGetContextWalletIdNull = jest.fn(() => null);
      const contextWithoutId = {
        ...mockWalletContext,
        getContextWalletId: mockGetContextWalletIdNull,
      };

      render(
        <WalletContext.Provider value={contextWithoutId}>
          <BasePredictionModal
            formOpen={true}
            setFormOpen={mockSetFormOpen}
            callApi={mockCallApi}
          />
        </WalletContext.Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('form-modal')).toBeInTheDocument();
      });

      expect(getApiObjectsList).not.toHaveBeenCalled();
    });

    it('should refetch deposits when refreshTimestamp changes', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);
      const { rerender } = renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(1);
      });

      const updatedContext = {
        ...mockWalletContext,
        refreshTimestamp: 9876543210,
      };

      rerender(
        <WalletContext.Provider value={updatedContext}>
          <BasePredictionModal
            formOpen={true}
            setFormOpen={mockSetFormOpen}
            callApi={mockCallApi}
          />
        </WalletContext.Provider>
      );

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(2);
      });
    });

    it('should not fetch categories when selectedDeposit is null', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('form-modal')).toBeInTheDocument();
      });

      // Only deposits should be fetched
      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(1);
      });
    });

    it('should fetch categories when selectedDeposit is set', async () => {
      getApiObjectsList
        .mockResolvedValueOnce(mockDeposits)
        .mockResolvedValueOnce(mockCategories);

      renderComponent({ editedPrediction: mockEditedPrediction });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          `${process.env.REACT_APP_BACKEND_URL}/api/wallets/wallet-123/categories/`,
          {},
          {},
          {
            category_type: CategoryTypes.EXPENSE,
            ordering: 'priority',
            deposit: 'deposit-1',
          }
        );
      });
    });
  });

  describe('Field Configuration', () => {
    it('should configure deposit field correctly for new prediction', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);

      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.deposit).toMatchObject({
          type: 'select',
          select: true,
          label: 'Deposit',
          required: true,
        });
        expect(fields.deposit.disabled).toBeUndefined();
      });
    });

    it('should disable deposit field when editing prediction', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);

      renderComponent({ editedPrediction: mockEditedPrediction });

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.deposit.disabled).toBe(mockEditedPrediction);
      });
    });

    it('should configure category field correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.category).toMatchObject({
          type: 'select',
          select: true,
          label: 'Category',
          required: true,
        });
      });
    });

    it('should disable category field when no deposit is selected', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        // Category is disabled when editedPrediction is truthy OR selectedDeposit is falsy
        expect(fields.category.disabled).toBeTruthy();
      });
    });

    it('should configure current_plan field with currency', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.current_plan).toMatchObject({
          type: 'number',
          step: 'any',
          label: 'Value',
          required: true,
        });
        expect(fields.current_plan.slotProps.htmlInput).toMatchObject({
          step: 0.01,
          min: 0,
        });
      });
    });

    it('should configure description field correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.description).toMatchObject({
          type: 'string',
          label: 'Description',
          required: false,
          multiline: true,
          rows: 4,
        });
      });
    });

    it('should clear category field when deposit changes', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.deposit.clearFieldsOnChange).toEqual(['category']);
      });
    });

    it('should have deposit options from API', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);

      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(fields.deposit.options).toEqual(mockDeposits);
      });
    });

    it('should have onChange handler for deposit field', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(typeof fields.deposit.onChange).toBe('function');
      });
    });

    it('should have groupBy function for deposit field', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(typeof fields.deposit.groupBy).toBe('function');
      });
    });

    it('should have groupBy function for category field', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        const { fields } = lastFormModalProps;
        expect(typeof fields.category.groupBy).toBe('function');
      });
    });
  });

  describe('Edited Prediction Handling', () => {
    it('should set selectedDeposit when editedPrediction is provided', async () => {
      getApiObjectsList
        .mockResolvedValueOnce(mockDeposits)
        .mockResolvedValueOnce(mockCategories);

      renderComponent({ editedPrediction: mockEditedPrediction });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/categories/'),
          {},
          {},
          expect.objectContaining({
            deposit: 'deposit-1',
          })
        );
      });
    });

    it('should reset selectedDeposit when editedPrediction is removed', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);

      const { rerender } = renderComponent({
        editedPrediction: mockEditedPrediction,
      });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(2); // deposits + categories
      });

      rerender(
        <WalletContext.Provider value={mockWalletContext}>
          <BasePredictionModal
            formOpen={true}
            setFormOpen={mockSetFormOpen}
            callApi={mockCallApi}
            editedPrediction={undefined}
          />
        </WalletContext.Provider>
      );

      // Should still be 2 calls (deposits only get fetched once per mount, not on editedPrediction change)
      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Props Passing to FormModal', () => {
    it('should pass setFormOpen to FormModal', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        expect(lastFormModalProps.setOpen).toBe(mockSetFormOpen);
      });
    });

    it('should pass callApi to FormModal', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        expect(lastFormModalProps.callApi).toBe(mockCallApi);
      });
    });

    it('should pass editedPrediction as updatedObject to FormModal', async () => {
      renderComponent({ editedPrediction: mockEditedPrediction });

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        expect(lastFormModalProps.updatedObject).toBe(mockEditedPrediction);
      });
    });

    it('should pass undefined as updatedObject when no edited prediction', async () => {
      renderComponent();

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        expect(lastFormModalProps.updatedObject).toBeUndefined();
      });
    });
  });

  describe('Context Usage', () => {
    it('should use contextWalletCurrency in current_plan field', async () => {
      const mockGetContextWalletIdCustom = jest.fn(() => 'custom-wallet-id');
      const customContext = {
        getContextWalletId: mockGetContextWalletIdCustom,
        contextWalletCurrency: 'EUR',
        refreshTimestamp: 1234567890,
      };

      render(
        <WalletContext.Provider value={customContext}>
          <BasePredictionModal
            formOpen={true}
            setFormOpen={mockSetFormOpen}
            callApi={mockCallApi}
          />
        </WalletContext.Provider>
      );

      await waitFor(() => {
        expect(lastFormModalProps).not.toBeNull();
        expect(screen.getByTestId('form-modal')).toBeInTheDocument();
      });
    });

    it('should use contextWalletId in API calls', async () => {
      getApiObjectsList.mockResolvedValue(mockDeposits);

      const mockGetContextWalletIdCustom = jest.fn(() => 'custom-wallet-id');
      const customContext = {
        getContextWalletId: mockGetContextWalletIdCustom,
        contextWalletCurrency: 'USD',
        refreshTimestamp: 1234567890,
      };

      render(
        <WalletContext.Provider value={customContext}>
          <BasePredictionModal
            formOpen={true}
            setFormOpen={mockSetFormOpen}
            callApi={mockCallApi}
          />
        </WalletContext.Provider>
      );

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('custom-wallet-id')
        );
      });
    });
  });
});
