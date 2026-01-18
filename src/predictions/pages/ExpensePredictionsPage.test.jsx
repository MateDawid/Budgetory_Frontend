import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ExpensePredictionsPage from './ExpensePredictionsPage';
import { WalletContext } from '../../app_infrastructure/store/WalletContext';
import { AlertContext } from '../../app_infrastructure/store/AlertContext';
import { getApiObjectsList } from '../../app_infrastructure/services/APIService';

// Mock the API service
jest.mock('../../app_infrastructure/services/APIService');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock PeriodStatuses
jest.mock('../../periods/utils/PeriodStatuses', () => ({
  DRAFT: 0,
  ACTIVE: 1,
  CLOSED: 2,
}));

// Mock child components
jest.mock('../components/PeriodFilterField', () => {
  return function MockPeriodFilterField({
    setPeriodFilter,
    setPeriodStatus,
    setPeriodStatusLabel,
  }) {
    return (
      <div data-testid="period-filter-field">
        <button
          onClick={() => {
            setPeriodFilter('period-1');
            setPeriodStatus(0); // DRAFT status
            setPeriodStatusLabel('Draft');
          }}
        >
          Select Period
        </button>
      </div>
    );
  };
});

jest.mock('../components/ExpensePredictionTable/ExpensePredictionTable', () => {
  return function MockExpensePredictionTable({ predictions }) {
    return (
      <div data-testid="expense-prediction-table">
        {predictions.map((pred) => (
          <div key={pred.id}>{pred.category}</div>
        ))}
      </div>
    );
  };
});

jest.mock('../components/PeriodResultsTable/PeriodResultsTable', () => {
  return function MockPeriodResultsTable({ results }) {
    return (
      <div data-testid="period-results-table">
        {results.map((result) => (
          <div key={result.id}>{result.deposit_name}</div>
        ))}
      </div>
    );
  };
});

jest.mock('../components/CopyPreviousPredictionsButton', () => {
  return function MockCopyPreviousPredictionsButton({ periodId }) {
    return periodId ? (
      <button data-testid="copy-previous-button">Copy Previous</button>
    ) : null;
  };
});

jest.mock('../components/PredictionModal/PredictionAddModal', () => {
  return function MockPredictionAddModal({ formOpen, setFormOpen }) {
    return formOpen ? (
      <div data-testid="prediction-add-modal">
        <button onClick={() => setFormOpen(false)}>Close Modal</button>
      </div>
    ) : null;
  };
});

jest.mock('../../app_infrastructure/components/FilterField', () => {
  return function MockFilterField({
    filterValue,
    setFilterValue,
    options,
    label,
    disabled,
  }) {
    return (
      <div data-testid={`filter-field-${label}`}>
        <select
          value={filterValue || ''}
          onChange={(e) => setFilterValue(e.target.value || null)}
          disabled={disabled}
          aria-label={label}
        >
          <option value="">All</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('../../app_infrastructure/components/StyledButton', () => {
  return function MockStyledButton({ children, onClick, disabled, startIcon }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid="styled-button">
        {startIcon}
        {children}
      </button>
    );
  };
});

describe('ExpensePredictionsPage', () => {
  const mockSetAlert = jest.fn();
  let mockGetContextWalletId;
  let mockRefreshTimestamp;
  let defaultWalletContext;
  let defaultAlertContext;

  const mockPeriods = [
    {
      value: 'period-1',
      label: 'January 2024',
      status: 0,
      status_display: 'Draft',
    },
    {
      value: 'period-2',
      label: 'February 2024',
      status: 0,
      status_display: 'Draft',
    },
  ];

  const mockDeposits = [
    { value: 'deposit-1', label: 'Main Account' },
    { value: 'deposit-2', label: 'Savings' },
  ];

  const mockPriorities = [
    { value: 1, label: 'High Priority' },
    { value: 2, label: 'Medium Priority' },
  ];

  const mockCategories = [
    { value: 'cat-1', label: 'Groceries', priority_display: 'High Priority' },
    { value: 'cat-2', label: 'Transport', priority_display: 'Medium Priority' },
  ];

  const mockProgressStatuses = [
    { value: 'on-track', label: 'On Track' },
    { value: 'over-wallet', label: 'Over Wallet' },
  ];

  const mockPredictions = [
    { id: 1, category: 'Groceries', current_plan: 500 },
    { id: 2, category: 'Transport', current_plan: 200 },
  ];

  const mockPeriodResults = [
    { id: 1, deposit_name: 'Main Account', total: 1000 },
    { id: 2, deposit_name: 'Savings', total: 500 },
  ];

  // Helper function to create standard mock API implementation
  const createMockApiImplementation = (overrides = {}) => {
    return (url) => {
      if (url.includes('/periods/'))
        return Promise.resolve(overrides.periods || mockPeriods);
      if (url.includes('/deposits/'))
        return Promise.resolve(overrides.deposits || mockDeposits);
      if (url.includes('/priorities/'))
        return Promise.resolve({
          results: overrides.priorities || mockPriorities,
        });
      if (url.includes('/progress_statuses/'))
        return Promise.resolve(
          overrides.progressStatuses || mockProgressStatuses
        );
      if (url.includes('/categories/'))
        return Promise.resolve(overrides.categories || mockCategories);
      if (url.includes('/expense_predictions/'))
        return Promise.resolve(overrides.predictions || mockPredictions);
      if (url.includes('/deposits_predictions_results/'))
        return Promise.resolve(overrides.periodResults || mockPeriodResults);
      return Promise.resolve([]);
    };
  };

  const renderComponent = (
    walletContext = defaultWalletContext,
    alertContext = defaultAlertContext
  ) => {
    return render(
      <MemoryRouter>
        <WalletContext.Provider value={walletContext}>
          <AlertContext.Provider value={alertContext}>
            <ExpensePredictionsPage />
          </AlertContext.Provider>
        </WalletContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    process.env.REACT_APP_BACKEND_URL = 'http://localhost:8000';

    // Recreate the mock function with implementation after clearAllMocks
    mockGetContextWalletId = jest.fn(() => 'wallet-123');
    mockRefreshTimestamp = Date.now();

    defaultWalletContext = {
      getContextWalletId: mockGetContextWalletId,
      refreshTimestamp: mockRefreshTimestamp,
    };

    defaultAlertContext = {
      setAlert: mockSetAlert,
    };

    // Default: return data for all endpoints
    getApiObjectsList.mockImplementation(createMockApiImplementation());
  });

  describe('Initial Rendering', () => {
    test('renders main header correctly', async () => {
      await act(async () => {
        renderComponent();
      });
      expect(
        screen.getByText('Expenses Predictions in Period')
      ).toBeInTheDocument();
    });

    test('renders period results section header', async () => {
      await act(async () => {
        renderComponent();
      });
      expect(screen.getByText('Period results')).toBeInTheDocument();
    });

    test('renders predictions section header', async () => {
      await act(async () => {
        renderComponent();
      });
      expect(screen.getByText('Predictions')).toBeInTheDocument();
    });

    test('shows "Period not selected" message initially', async () => {
      await act(async () => {
        renderComponent();
      });
      const messages = screen.getAllByText('Period not selected.');
      expect(messages).toHaveLength(2);
    });

    test('renders period filter field component', async () => {
      await act(async () => {
        renderComponent();
      });
      expect(screen.getByTestId('period-filter-field')).toBeInTheDocument();
    });
  });

  describe('Data Fetching on Mount', () => {
    test('fetches periods on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/api/wallets/wallet-123/periods/')
        );
      });
    });

    test('fetches deposits on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/wallets/wallet-123/deposits/?ordering=name&fields=value,label'
        );
      });
    });

    test('fetches priorities on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/categories/priorities/?type=2'
        );
      });
    });

    test('fetches progress statuses on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/predictions/progress_statuses/'
        );
      });
    });

    test('navigates to wallets page when contextWalletId is null', async () => {
      const noWalletContext = {
        getContextWalletId: jest.fn(() => null),
        refreshTimestamp: mockRefreshTimestamp,
      };

      renderComponent(noWalletContext);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/wallets');
        expect(mockSetAlert).toHaveBeenCalledWith({
          type: 'warning',
          message: 'Predictions are unavailable. Please create a Wallet first.',
        });
      });
    });
  });

  describe('Period Selection', () => {
    test('fetches predictions when period is selected', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/wallets/wallet-123/expense_predictions/',
          {},
          {},
          expect.objectContaining({ period: 'period-1' })
        );
      });
    });

    test('fetches period results when period is selected', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/wallets/wallet-123/deposits_predictions_results/period-1/'
        );
      });
    });

    test('displays loading spinner while fetching predictions', async () => {
      let resolvePredictions;
      let resolveResults;
      const predictionsPromise = new Promise((resolve) => {
        resolvePredictions = resolve;
      });
      const resultsPromise = new Promise((resolve) => {
        resolveResults = resolve;
      });

      getApiObjectsList.mockImplementation((url) => {
        if (url.includes('/expense_predictions/')) return predictionsPromise;
        if (url.includes('/deposits_predictions_results/'))
          return resultsPromise;
        return Promise.resolve(createMockApiImplementation()(url));
      });

      await act(async () => {
        renderComponent();
      });

      await act(async () => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        const spinners = screen.getAllByRole('progressbar');
        expect(spinners.length).toBeGreaterThanOrEqual(1);
      });

      await act(async () => {
        resolvePredictions(mockPredictions);
        resolveResults(mockPeriodResults);
      });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    test('displays prediction table when predictions are loaded', async () => {
      await act(async () => {
        renderComponent();
      });

      await act(async () => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('expense-prediction-table')
        ).toBeInTheDocument();
      });
    });

    test('displays period results table when results are loaded', async () => {
      await act(async () => {
        renderComponent();
      });

      await act(async () => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('period-results-table')).toBeInTheDocument();
      });
    });

    test('displays period status chip when period is selected', async () => {
      await act(async () => {
        renderComponent();
      });

      await act(async () => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Draft')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Functionality', () => {
    test('displays filter fields when period is selected', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('filter-field-Deposit')).toBeInTheDocument();
        expect(
          screen.getByTestId('filter-field-Category Priority')
        ).toBeInTheDocument();
        expect(screen.getByTestId('filter-field-Category')).toBeInTheDocument();
        expect(screen.getByTestId('filter-field-Progress')).toBeInTheDocument();
        expect(screen.getByTestId('filter-field-Sort by')).toBeInTheDocument();
      });
    });

    test('fetches categories when priority filter is applied', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('filter-field-Category Priority')
        ).toBeInTheDocument();
      });

      act(() => {
        const priorityFilter = screen.getByLabelText('Category Priority');
        fireEvent.change(priorityFilter, { target: { value: '1' } });
      });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/wallets/wallet-123/categories/?category_type=2',
          {},
          {},
          expect.objectContaining({ priority: '1' })
        );
      });
    });

    test('fetches categories when deposit filter is applied', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('filter-field-Deposit')).toBeInTheDocument();
      });

      act(() => {
        const depositFilter = screen.getByLabelText('Deposit');
        fireEvent.change(depositFilter, { target: { value: 'deposit-1' } });
      });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/wallets/wallet-123/categories/?category_type=2',
          {},
          {},
          expect.objectContaining({ deposit: 'deposit-1' })
        );
      });
    });

    test('category filter is disabled when no deposit is selected', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        const categoryFilter = screen.getByLabelText('Category');
        expect(categoryFilter).toBeDisabled();
      });
    });

    test('applies multiple filters and fetches predictions', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('filter-field-Deposit')).toBeInTheDocument();
      });

      act(() => {
        const depositFilter = screen.getByLabelText('Deposit');
        fireEvent.change(depositFilter, { target: { value: 'deposit-1' } });

        const progressFilter = screen.getByLabelText('Progress');
        fireEvent.change(progressFilter, { target: { value: 'on-track' } });
      });

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          'http://localhost:8000/api/wallets/wallet-123/expense_predictions/',
          {},
          {},
          expect.objectContaining({
            period: 'period-1',
            deposit: 'deposit-1',
            progress_status: 'on-track',
          })
        );
      });
    });
  });

  describe('Empty States', () => {
    test('displays "No Predictions found" when period is selected but no predictions exist', async () => {
      getApiObjectsList.mockImplementation(
        createMockApiImplementation({ predictions: [] })
      );

      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByText('No Predictions found.')).toBeInTheDocument();
      });
    });

    test('displays "No Period results to display" when period results are empty', async () => {
      getApiObjectsList.mockImplementation(
        createMockApiImplementation({ periodResults: [] })
      );

      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText('No Period results to display.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Add Prediction Functionality', () => {
    test('displays add button when predictions exist', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('expense-prediction-table')
        ).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add');
      expect(addButton).toBeInTheDocument();
    });

    test('opens add modal when add button is clicked', async () => {
      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('expense-prediction-table')
        ).toBeInTheDocument();
      });

      act(() => {
        const addButton = screen.getByText('Add');
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByTestId('prediction-add-modal')).toBeInTheDocument();
      });
    });

    test('displays add button in empty state for draft periods', async () => {
      getApiObjectsList.mockImplementation(
        createMockApiImplementation({
          predictions: [],
          periodResults: [],
          categories: [],
        })
      );

      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByText('No Predictions found.')).toBeInTheDocument();
      });

      // Debug: let's see what's actually rendered
      await waitFor(() => {
        const addButton = screen.queryByText('Add');
        if (!addButton) {
          // Button should be there, let's check the whole DOM
          screen.debug(null, 300000);
        }
        expect(screen.getByText('Add')).toBeInTheDocument();
      });
    });
  });

  describe('Copy Previous Predictions', () => {
    test('displays copy previous button when conditions are met', async () => {
      getApiObjectsList.mockImplementation(
        createMockApiImplementation({
          predictions: [],
          periodResults: [],
          categories: [],
        })
      );

      renderComponent();

      act(() => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(screen.getByText('No Predictions found.')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('copy-previous-button')).toBeInTheDocument();
      });
    });
  });

  describe('Refresh Functionality', () => {
    test('refetches data when refreshTimestamp changes', async () => {
      const { rerender } = render(
        <MemoryRouter>
          <WalletContext.Provider value={defaultWalletContext}>
            <AlertContext.Provider value={defaultAlertContext}>
              <ExpensePredictionsPage />
            </AlertContext.Provider>
          </WalletContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(
          screen.getByText('Expenses Predictions in Period')
        ).toBeInTheDocument();
      });

      await act(async () => {
        const selectButton = screen.getByText('Select Period');
        fireEvent.click(selectButton);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('expense-prediction-table')
        ).toBeInTheDocument();
      });

      const callCountBefore = getApiObjectsList.mock.calls.length;

      const newTimestamp = Date.now() + 1000;
      await act(async () => {
        rerender(
          <MemoryRouter>
            <WalletContext.Provider
              value={{
                ...defaultWalletContext,
                refreshTimestamp: newTimestamp,
              }}
            >
              <AlertContext.Provider value={defaultAlertContext}>
                <ExpensePredictionsPage />
              </AlertContext.Provider>
            </WalletContext.Provider>
          </MemoryRouter>
        );
      });

      await waitFor(
        () => {
          expect(getApiObjectsList.mock.calls.length).toBeGreaterThan(
            callCountBefore
          );
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully for periods', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      getApiObjectsList.mockImplementation((url) => {
        if (url.includes('/periods/'))
          return Promise.reject(new Error('API Error'));
        return Promise.resolve(createMockApiImplementation()(url));
      });

      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText('Expenses Predictions in Period')
        ).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });
});
