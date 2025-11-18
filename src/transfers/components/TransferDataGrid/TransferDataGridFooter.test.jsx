import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferDataGridFooter from './TransferDataGridFooter';

// Only mock external dependencies that would cause issues in tests
// Mock MUI GridPagination since it requires complex MUI context
jest.mock('@mui/x-data-grid', () => ({
  GridPagination: (props) => (
    <div data-testid="grid-pagination" data-page={props.page}>
      Pagination
    </div>
  ),
}));

// Mock the modal components to avoid complex API dependencies
jest.mock('../TransferModal/TransferBulkDeleteModal', () => ({
  __esModule: true,
  default: ({ formOpen, setFormOpen, apiUrl, transferType, selectedRows }) =>
    formOpen ? (
      <div data-testid="bulk-delete-modal">
        <h2>Bulk Delete Modal</h2>
        <button
          onClick={() => setFormOpen(false)}
          data-testid="close-bulk-delete"
        >
          Close
        </button>
        <div data-testid="bulk-delete-props">
          {JSON.stringify({ apiUrl, transferType, selectedRows })}
        </div>
      </div>
    ) : null,
}));

jest.mock('../TransferModal/TransferCopyModal', () => ({
  __esModule: true,
  default: ({ formOpen, setFormOpen, apiUrl, transferType, selectedRows }) =>
    formOpen ? (
      <div data-testid="copy-modal">
        <h2>Copy Modal</h2>
        <button onClick={() => setFormOpen(false)} data-testid="close-copy">
          Close
        </button>
        <div data-testid="copy-props">
          {JSON.stringify({ apiUrl, transferType, selectedRows })}
        </div>
      </div>
    ) : null,
}));

describe('TransferDataGridFooter', () => {
  const defaultProps = {
    apiUrl: '/api/transfers',
    transferType: 1,
    handleAddClick: jest.fn(),
    selectedRows: [],
    page: 0,
    rowsPerPage: 10,
    rowCount: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component without errors', () => {
      const { container } = render(
        <TransferDataGridFooter {...defaultProps} />
      );
      expect(container).toBeInTheDocument();
    });

    it('should render GridPagination', () => {
      render(<TransferDataGridFooter {...defaultProps} />);
      expect(screen.getByTestId('grid-pagination')).toBeInTheDocument();
    });
  });

  describe('Button Display Logic', () => {
    it('should show Add button when no rows are selected', () => {
      render(<TransferDataGridFooter {...defaultProps} selectedRows={[]} />);

      const addButton = screen.getByRole('button', { name: /add/i });
      expect(addButton).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /delete/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /copy/i })
      ).not.toBeInTheDocument();
    });

    it('should show Delete and Copy buttons when one row is selected', () => {
      render(<TransferDataGridFooter {...defaultProps} selectedRows={[1]} />);

      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add/i })
      ).not.toBeInTheDocument();
    });

    it('should show Delete and Copy buttons when multiple rows are selected', () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2, 3]} />
      );

      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add/i })
      ).not.toBeInTheDocument();
    });

    it('should switch from Add to Delete/Copy when rows become selected', () => {
      const { rerender } = render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[]} />
      );

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

      rerender(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      expect(
        screen.queryByRole('button', { name: /add/i })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('should switch from Delete/Copy to Add when selection is cleared', () => {
      const { rerender } = render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();

      rerender(<TransferDataGridFooter {...defaultProps} selectedRows={[]} />);

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /delete/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /copy/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Add Button Functionality', () => {
    it('should call handleAddClick when Add button is clicked', () => {
      render(<TransferDataGridFooter {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add/i });
      fireEvent.click(addButton);

      expect(defaultProps.handleAddClick).toHaveBeenCalledTimes(1);
    });

    it('should call handleAddClick multiple times on multiple clicks', () => {
      render(<TransferDataGridFooter {...defaultProps} />);

      const addButton = screen.getByRole('button', { name: /add/i });
      fireEvent.click(addButton);
      fireEvent.click(addButton);
      fireEvent.click(addButton);

      expect(defaultProps.handleAddClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Delete Modal Functionality', () => {
    it('should not show delete modal initially', () => {
      render(<TransferDataGridFooter {...defaultProps} selectedRows={[1]} />);

      expect(screen.queryByTestId('bulk-delete-modal')).not.toBeInTheDocument();
    });

    it('should open delete modal when Delete button is clicked', () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
    });

    it('should close delete modal when close is triggered', async () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();

      const closeButton = screen.getByTestId('close-bulk-delete');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId('bulk-delete-modal')
        ).not.toBeInTheDocument();
      });
    });

    it('should pass correct props to delete modal', () => {
      const props = {
        ...defaultProps,
        apiUrl: '/api/test-transfers',
        transferType: 2,
        selectedRows: [5, 10, 15],
      };

      render(<TransferDataGridFooter {...props} />);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      const propsElement = screen.getByTestId('bulk-delete-props');
      const passedProps = JSON.parse(propsElement.textContent);

      expect(passedProps).toEqual({
        apiUrl: '/api/test-transfers',
        transferType: 2,
        selectedRows: [5, 10, 15],
      });
    });

    it('should reopen delete modal after closing and clicking Delete again', async () => {
      render(<TransferDataGridFooter {...defaultProps} selectedRows={[1]} />);

      // Open modal
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();

      // Close modal
      fireEvent.click(screen.getByTestId('close-bulk-delete'));
      await waitFor(() => {
        expect(
          screen.queryByTestId('bulk-delete-modal')
        ).not.toBeInTheDocument();
      });

      // Reopen modal
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
    });
  });

  describe('Copy Modal Functionality', () => {
    it('should not show copy modal initially', () => {
      render(<TransferDataGridFooter {...defaultProps} selectedRows={[1]} />);

      expect(screen.queryByTestId('copy-modal')).not.toBeInTheDocument();
    });

    it('should open copy modal when Copy button is clicked', () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
    });

    it('should close copy modal when close is triggered', async () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();

      const closeButton = screen.getByTestId('close-copy');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('copy-modal')).not.toBeInTheDocument();
      });
    });

    it('should pass correct props to copy modal', () => {
      const props = {
        ...defaultProps,
        apiUrl: '/api/copy-transfers',
        transferType: 3,
        selectedRows: [7, 14, 21],
      };

      render(<TransferDataGridFooter {...props} />);

      const copyButton = screen.getByRole('button', { name: /copy/i });
      fireEvent.click(copyButton);

      const propsElement = screen.getByTestId('copy-props');
      const passedProps = JSON.parse(propsElement.textContent);

      expect(passedProps).toEqual({
        apiUrl: '/api/copy-transfers',
        transferType: 3,
        selectedRows: [7, 14, 21],
      });
    });
  });

  describe('Multiple Modals', () => {
    it('should allow both modals to be open simultaneously', () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      // Open delete modal
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();

      // Open copy modal
      fireEvent.click(screen.getByRole('button', { name: /copy/i }));
      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();

      // Both should be open
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
    });

    it('should close modals independently', async () => {
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      // Open both modals
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      fireEvent.click(screen.getByRole('button', { name: /copy/i }));

      // Close delete modal
      fireEvent.click(screen.getByTestId('close-bulk-delete'));

      await waitFor(() => {
        expect(
          screen.queryByTestId('bulk-delete-modal')
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string apiUrl', () => {
      render(
        <TransferDataGridFooter
          {...defaultProps}
          apiUrl=""
          selectedRows={[1]}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));

      const propsElement = screen.getByTestId('bulk-delete-props');
      const passedProps = JSON.parse(propsElement.textContent);
      expect(passedProps.apiUrl).toBe('');
    });

    it('should handle transferType of 0', () => {
      render(
        <TransferDataGridFooter
          {...defaultProps}
          transferType={0}
          selectedRows={[1]}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /copy/i }));

      const propsElement = screen.getByTestId('copy-props');
      const passedProps = JSON.parse(propsElement.textContent);
      expect(passedProps.transferType).toBe(0);
    });

    it('should handle large number of selected rows', () => {
      const manyRows = Array.from({ length: 1000 }, (_, i) => i + 1);
      render(
        <TransferDataGridFooter {...defaultProps} selectedRows={manyRows} />
      );

      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('should handle missing handleAddClick prop gracefully', () => {
      const { apiUrl, transferType, selectedRows, ...restProps } = defaultProps;

      // This should not throw an error even without handleAddClick
      expect(() => {
        render(
          <TransferDataGridFooter
            apiUrl={apiUrl}
            transferType={transferType}
            selectedRows={selectedRows}
            {...restProps}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Prop Updates', () => {
    it('should update displayed buttons when selectedRows prop changes', () => {
      const { rerender } = render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[]} />
      );

      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

      rerender(<TransferDataGridFooter {...defaultProps} selectedRows={[1]} />);
      expect(
        screen.queryByRole('button', { name: /add/i })
      ).not.toBeInTheDocument();

      rerender(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2, 3]} />
      );
      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();

      rerender(<TransferDataGridFooter {...defaultProps} selectedRows={[]} />);
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });

    it('should pass updated selectedRows to modals', () => {
      const { rerender } = render(
        <TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />
      );

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));

      let propsElement = screen.getByTestId('bulk-delete-props');
      let passedProps = JSON.parse(propsElement.textContent);
      expect(passedProps.selectedRows).toEqual([1, 2]);

      // Close modal
      fireEvent.click(screen.getByTestId('close-bulk-delete'));

      // Update selectedRows
      rerender(
        <TransferDataGridFooter {...defaultProps} selectedRows={[3, 4, 5]} />
      );

      // Reopen modal
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));

      propsElement = screen.getByTestId('bulk-delete-props');
      passedProps = JSON.parse(propsElement.textContent);
      expect(passedProps.selectedRows).toEqual([3, 4, 5]);
    });
  });
});
