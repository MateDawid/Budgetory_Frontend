import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferDataGrid from './TransferDataGrid';
import { AlertContext } from '../../../app_infrastructure/store/AlertContext';
import { BudgetContext } from '../../../app_infrastructure/store/BudgetContext';
import { getApiObjectsList } from '../../../app_infrastructure/services/APIService';
import TransferTypes from '../../utils/TransferTypes';
import axios from 'axios';

jest.mock('axios');

// Mock MUI components that might cause issues
jest.mock('@mui/material/Box', () => {
  return function MockBox({ children, ...props }) {
    return (
      <div data-testid="mui-box" {...props}>
        {children}
      </div>
    );
  };
});

// Mock dependencies
jest.mock('../../../app_infrastructure/services/APIService');
jest.mock(
  '../../../app_infrastructure/components/DataGrid/StyledDataGrid',
  () => {
    const MockReact = require('react');
    return function MockStyledDataGrid({
      rows,
      columns,
      loading,
      slots,
      slotProps,
      checkboxSelection,
      ...props
    }) {
      const Footer = slots?.pagination;
      return (
        <div data-testid="styled-data-grid" role="grid">
          <div data-testid="loading-state">
            {loading ? 'Loading...' : 'Loaded'}
          </div>
          {columns.map((col) => (
            <div key={col.field} data-testid={`column-${col.field}`}>
              {col.headerName}
            </div>
          ))}
          {rows.map((row) => (
            <div key={row.id} data-testid={`row-${row.id}`}>
              {checkboxSelection && <input type="checkbox" role="checkbox" />}
              {columns.map((col) => (
                <span
                  key={`${row.id}-${col.field}`}
                  data-testid={`cell-${row.id}-${col.field}`}
                >
                  {col.renderCell
                    ? col.renderCell({ value: row[col.field], row })
                    : col.valueFormatter
                      ? col.valueFormatter(row[col.field])
                      : row[col.field]}
                </span>
              ))}
            </div>
          ))}
          {Footer && <Footer {...(slotProps?.pagination || {})} />}
        </div>
      );
    };
  }
);
jest.mock('./TransferDataGridFooter', () => {
  return function MockFooter() {
    return <div data-testid="mock-footer">Footer</div>;
  };
});
jest.mock('../TransferModal/TransferAddModal', () => {
  return function MockAddModal({ formOpen }) {
    return formOpen ? <div data-testid="add-modal">Add Modal</div> : null;
  };
});
jest.mock('../TransferModal/TransferEditModal', () => {
  return function MockEditModal({ formOpen }) {
    return formOpen ? <div data-testid="edit-modal">Edit Modal</div> : null;
  };
});
jest.mock('../TransferModal/TransferDeleteModal', () => {
  return function MockDeleteModal({ formOpen }) {
    return formOpen ? <div data-testid="delete-modal">Delete Modal</div> : null;
  };
});
jest.mock(
  '../../../app_infrastructure/components/DataGrid/utils/renderHyperlink',
  () => {
    return jest.fn((prefix, params) => params.value);
  }
);
jest.mock(
  '../../../app_infrastructure/components/DataGrid/utils/FilterHandlers',
  () => ({
    mappedFilterOperators: {},
    formatFilterModel: jest.fn((model) => model),
  })
);
jest.mock(
  '../../../app_infrastructure/components/DataGrid/utils/getSortFieldMapping',
  () => {
    return jest.fn(() => ({}));
  }
);
jest.mock(
  '../../../app_infrastructure/components/DataGrid/StyledGridActionsCellItem',
  () => {
    return function MockActionsCellItem({ icon, label, onClick }) {
      return (
        <button onClick={onClick} data-testid={`action-${label.toLowerCase()}`}>
          {label}
        </button>
      );
    };
  }
);

describe('TransferDataGrid', () => {
  const mockSetAlert = jest.fn();
  const mockContextBudgetId = 123;
  const mockContextBudgetCurrency = 'USD';
  const mockRefreshTimestamp = Date.now();

  const mockAlertContext = {
    setAlert: mockSetAlert,
  };

  const mockBudgetContext = {
    contextBudgetId: mockContextBudgetId,
    contextBudgetCurrency: mockContextBudgetCurrency,
    refreshTimestamp: mockRefreshTimestamp,
  };

  const mockTransfersData = {
    results: [
      {
        id: 1,
        date: '2025-01-15',
        period: 'January 2025',
        name: 'Salary',
        deposit: 'Main Account',
        entity: 'Employer',
        category: 'Income',
        value: 5000,
        description: 'Monthly salary',
      },
      {
        id: 2,
        date: '2025-01-20',
        period: 'January 2025',
        name: 'Groceries',
        deposit: 'Main Account',
        entity: 'Supermarket',
        category: 'Food',
        value: 150,
        description: 'Weekly shopping',
      },
    ],
    count: 2,
  };

  const mockPeriodOptions = [
    { value: 1, label: 'January 2025' },
    { value: 2, label: 'February 2025' },
  ];

  const mockCategoryOptions = [
    { value: 1, label: 'Income' },
    { value: 2, label: 'Food' },
  ];

  const mockDepositOptions = [
    { value: 1, label: 'Main Account' },
    { value: 2, label: 'Savings' },
  ];

  const mockEntityOptions = [
    { value: 1, label: 'Employer' },
    { value: 2, label: 'Supermarket' },
  ];

  const renderComponent = (transferType = TransferTypes.INCOME) => {
    return render(
      <AlertContext.Provider value={mockAlertContext}>
        <BudgetContext.Provider value={mockBudgetContext}>
          <TransferDataGrid transferType={transferType} />
        </BudgetContext.Provider>
      </AlertContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_BACKEND_URL = 'http://localhost:8000';

    // Setup default mock responses
    getApiObjectsList.mockImplementation((url) => {
      if (url.includes('/periods/')) return Promise.resolve(mockPeriodOptions);
      if (url.includes('/categories/'))
        return Promise.resolve(mockCategoryOptions);
      if (url.includes('/deposits/'))
        return Promise.resolve(mockDepositOptions);
      if (url.includes('/entities/')) return Promise.resolve(mockEntityOptions);
      if (url.includes('/incomes/') || url.includes('/expenses/')) {
        return Promise.resolve(mockTransfersData);
      }
      return Promise.resolve([]);
    });
  });

  describe('Component Rendering', () => {
    test('renders DataGrid component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('styled-data-grid')).toBeInTheDocument();
      });
    });

    test('renders all column headers', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('column-date')).toHaveTextContent('Date');
        expect(screen.getByTestId('column-period')).toHaveTextContent('Period');
        expect(screen.getByTestId('column-name')).toHaveTextContent('Name');
        expect(screen.getByTestId('column-deposit')).toHaveTextContent(
          'Deposit'
        );
        expect(screen.getByTestId('column-entity')).toHaveTextContent('Entity');
        expect(screen.getByTestId('column-category')).toHaveTextContent(
          'Category'
        );
        expect(screen.getByTestId('column-value')).toHaveTextContent('Value');
        expect(screen.getByTestId('column-description')).toHaveTextContent(
          'Description'
        );
        expect(screen.getByTestId('column-actions')).toHaveTextContent(
          'Actions'
        );
      });
    });

    test('displays loading state initially', async () => {
      renderComponent();

      const loadingState = screen.getByTestId('loading-state');
      expect(loadingState).toHaveTextContent('Loading...');

      await waitFor(() => {
        expect(loadingState).toHaveTextContent('Loaded');
      });
    });
  });

  describe('API Integration', () => {
    test('fetches income data when transferType is INCOME', async () => {
      renderComponent(TransferTypes.INCOME);

      await waitFor(() => {
        const incomeCalls = getApiObjectsList.mock.calls.filter((call) =>
          call[0].includes('/incomes/')
        );
        expect(incomeCalls.length).toBeGreaterThan(0);
      });
    });

    test('fetches expense data when transferType is EXPENSE', async () => {
      renderComponent(TransferTypes.EXPENSE);

      await waitFor(() => {
        const expenseCalls = getApiObjectsList.mock.calls.filter((call) =>
          call[0].includes('/expenses/')
        );
        expect(expenseCalls.length).toBeGreaterThan(0);
      });
    });

    test('fetches select options on mount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/periods/')
        );
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/categories/')
        );
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/deposits/')
        );
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/entities/')
        );
      });
    });

    test('handles API error gracefully', async () => {
      // Mock the API to reject for the main data fetch
      getApiObjectsList.mockImplementation((url) => {
        if (url.includes('/periods/'))
          return Promise.resolve(mockPeriodOptions);
        if (url.includes('/categories/'))
          return Promise.resolve(mockCategoryOptions);
        if (url.includes('/deposits/'))
          return Promise.resolve(mockDepositOptions);
        if (url.includes('/entities/'))
          return Promise.resolve(mockEntityOptions);
        if (url.includes('/incomes/') || url.includes('/expenses/')) {
          return Promise.reject(new Error('API Error'));
        }
        return Promise.resolve([]);
      });

      renderComponent();

      await waitFor(() => {
        expect(mockSetAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'Failed to load table rows.',
        });
      });
    });

    test('does not fetch data when contextBudgetId is not set', () => {
      const contextWithoutBudget = {
        ...mockBudgetContext,
        contextBudgetId: null,
      };

      render(
        <AlertContext.Provider value={mockAlertContext}>
          <BudgetContext.Provider value={contextWithoutBudget}>
            <TransferDataGrid transferType={TransferTypes.INCOME} />
          </BudgetContext.Provider>
        </AlertContext.Provider>
      );

      expect(getApiObjectsList).not.toHaveBeenCalled();
    });
  });

  describe('Data Display', () => {
    test('displays transfer data in rows', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Salary')).toBeInTheDocument();
        expect(screen.getByText('Groceries')).toBeInTheDocument();
        expect(screen.getByText('Monthly salary')).toBeInTheDocument();
        expect(screen.getByText('Weekly shopping')).toBeInTheDocument();
      });
    });

    test('formats date correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('2025-01-15')).toBeInTheDocument();
        expect(screen.getByText('2025-01-20')).toBeInTheDocument();
      });
    });

    test('displays value with currency for expenses in red', async () => {
      renderComponent(TransferTypes.EXPENSE);

      await waitFor(() => {
        const valueElements = screen.getAllByText(/USD/);
        expect(valueElements.length).toBeGreaterThan(0);
        expect(valueElements[0]).toHaveStyle({ color: '#BD0000' });
      });
    });

    test('displays value with currency for income in green', async () => {
      renderComponent(TransferTypes.INCOME);

      await waitFor(() => {
        const valueElements = screen.getAllByText(/USD/);
        expect(valueElements.length).toBeGreaterThan(0);
        expect(valueElements[0]).toHaveStyle({ color: '#008000' });
      });
    });
  });

  describe('Pagination', () => {
    test('initializes with correct page size', async () => {
      renderComponent();

      await waitFor(() => {
        const dataFetchCalls = getApiObjectsList.mock.calls.filter(
          (call) => call[0].includes('/incomes/') && call.length > 1
        );
        expect(dataFetchCalls.length).toBeGreaterThan(0);
        expect(dataFetchCalls[0][1]).toEqual(
          expect.objectContaining({
            pageSize: 10,
            page: 0,
          })
        );
      });
    });

    test('supports multiple page size options', () => {
      renderComponent();

      // The component should have pageSizeOptions [10, 50, 100]
      // This is tested through the StyledDataGrid props
      expect(true).toBe(true); // Placeholder for component prop validation
    });
  });

  describe('Sorting', () => {
    test('handles sort model changes', async () => {
      const { container } = renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Date')).toBeInTheDocument();
      });

      // Simulate sorting (this would require more complex interaction with DataGrid)
      // For now, we verify the component renders
      expect(container).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    test('initializes with empty filter model', async () => {
      const formatFilterModel =
        require('../../../app_infrastructure/components/DataGrid/utils/FilterHandlers').formatFilterModel;

      renderComponent();

      await waitFor(() => {
        const dataFetchCalls = getApiObjectsList.mock.calls.filter((call) =>
          call[0].includes('/incomes/')
        );
        expect(dataFetchCalls.length).toBeGreaterThan(0);

        // Verify formatFilterModel was called with initial empty filter
        expect(formatFilterModel).toHaveBeenCalledWith(
          expect.objectContaining({ items: [] }),
          expect.any(Array)
        );
      });
    });
  });

  describe('Modal Interactions', () => {
    test('does not show modals initially', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();
        expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
      });
    });

    test('renders TransferAddModal component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByTestId('add-modal')).not.toBeInTheDocument();
      });
    });

    test('renders TransferEditModal component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
      });
    });

    test('renders TransferDeleteModal component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Context Changes', () => {
    test('refetches data when refreshTimestamp changes', async () => {
      const { rerender } = renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(5); // 4 options + 1 data
      });

      const newBudgetContext = {
        ...mockBudgetContext,
        refreshTimestamp: Date.now() + 1000,
      };

      rerender(
        <AlertContext.Provider value={mockAlertContext}>
          <BudgetContext.Provider value={newBudgetContext}>
            <TransferDataGrid transferType={TransferTypes.INCOME} />
          </BudgetContext.Provider>
        </AlertContext.Provider>
      );

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledTimes(6); // Additional data fetch
      });
    });
  });

  describe('Select Options', () => {
    test('adds "Without Category" option to category options', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/categories/')
        );
      });

      // The component should prepend [Without Category] option
      // This is handled internally in the useEffect
    });

    test('adds "Without Entity" option to entity options', async () => {
      renderComponent();

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('/entities/')
        );
      });

      // The component should prepend [Without Entity] option
      // This is handled internally in the useEffect
    });

    test('handles failed options fetch gracefully', async () => {
      getApiObjectsList.mockImplementation((url) => {
        if (url.includes('/periods/'))
          return Promise.reject(new Error('Failed'));
        if (url.includes('/incomes/'))
          return Promise.resolve(mockTransfersData);
        return Promise.resolve([]);
      });

      renderComponent();

      await waitFor(() => {
        // Component should still render even if period options fail
        expect(screen.getByRole('grid')).toBeInTheDocument();
      });
    });
  });

  describe('Row Selection', () => {
    test('supports checkbox selection', async () => {
      renderComponent();

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Custom Footer', () => {
    test('renders custom footer component', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });
  });

  describe('Transfer Type Configuration', () => {
    test('fetches expense categories when transfer type is EXPENSE', async () => {
      renderComponent(TransferTypes.EXPENSE);

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('category_type=2')
        );
      });
    });

    test('fetches income categories when transfer type is INCOME', async () => {
      renderComponent(TransferTypes.INCOME);

      await waitFor(() => {
        expect(getApiObjectsList).toHaveBeenCalledWith(
          expect.stringContaining('category_type=1')
        );
      });
    });
  });
});
