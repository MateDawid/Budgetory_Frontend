import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferDataGridFooter from './TransferDataGridFooter';
import { GridPagination } from "@mui/x-data-grid";

// Mock the components
jest.mock('@mui/x-data-grid', () => ({
  GridPagination: (props) => <div data-testid="grid-pagination">Pagination</div>
}));

jest.mock('@mui/icons-material/Delete', () => ({
  __esModule: true,
  default: () => <span data-testid="delete-icon">DeleteIcon</span>
}));

jest.mock('@mui/icons-material/Add', () => ({
  __esModule: true,
  default: () => <span data-testid="add-icon">AddIcon</span>
}));

jest.mock('@mui/icons-material/ContentCopy', () => ({
  __esModule: true,
  default: () => <span data-testid="copy-icon">ContentCopyIcon</span>
}));

jest.mock('../../../app_infrastructure/components/StyledButton', () => ({
  __esModule: true,
  default: ({ children, onClick, startIcon, variant, sx }) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      data-testid={`styled-button-${children.toLowerCase()}`}
    >
      {startIcon}
      {children}
    </button>
  )
}));

jest.mock('../TransferModal/TransferBulkDeleteModal', () => ({
  __esModule: true,
  default: ({ formOpen, setFormOpen, apiUrl, transferType, selectedRows }) => (
    formOpen ? (
      <div data-testid="bulk-delete-modal">
        <span>BulkDeleteModal</span>
        <button onClick={() => setFormOpen(false)}>Close</button>
        <span data-testid="bulk-delete-api-url">{apiUrl}</span>
        <span data-testid="bulk-delete-transfer-type">{transferType}</span>
        <span data-testid="bulk-delete-selected-rows">{selectedRows.join(',')}</span>
      </div>
    ) : null
  )
}));

jest.mock('../TransferModal/TransferCopyModal', () => ({
  __esModule: true,
  default: ({ formOpen, setFormOpen, apiUrl, transferType, selectedRows }) => (
    formOpen ? (
      <div data-testid="copy-modal">
        <span>CopyModal</span>
        <button onClick={() => setFormOpen(false)}>Close</button>
        <span data-testid="copy-api-url">{apiUrl}</span>
        <span data-testid="copy-transfer-type">{transferType}</span>
        <span data-testid="copy-selected-rows">{selectedRows.join(',')}</span>
      </div>
    ) : null
  )
}));

describe('TransferDataGridFooter', () => {
  const defaultProps = {
    apiUrl: '/api/transfers',
    transferType: 1,
    handleAddClick: jest.fn(),
    selectedRows: [],
    page: 0,
    rowsPerPage: 10,
    rowCount: 100
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<TransferDataGridFooter {...defaultProps} />);
      expect(screen.getByTestId('grid-pagination')).toBeInTheDocument();
    });

    it('should render Add button when no rows are selected', () => {
      render(<TransferDataGridFooter {...defaultProps} />);
      expect(screen.getByTestId('styled-button-add')).toBeInTheDocument();
      expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    });

    it('should render Delete and Copy buttons when rows are selected', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3] };
      render(<TransferDataGridFooter {...props} />);
      
      expect(screen.getByTestId('styled-button-delete')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-copy')).toBeInTheDocument();
      expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
    });

    it('should not render Add button when rows are selected', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3] };
      render(<TransferDataGridFooter {...props} />);
      
      expect(screen.queryByTestId('styled-button-add')).not.toBeInTheDocument();
    });

    it('should always render GridPagination', () => {
      const { rerender } = render(<TransferDataGridFooter {...defaultProps} />);
      expect(screen.getByTestId('grid-pagination')).toBeInTheDocument();
      
      rerender(<TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />);
      expect(screen.getByTestId('grid-pagination')).toBeInTheDocument();
    });
  });

  describe('Button Interactions', () => {
    it('should call handleAddClick when Add button is clicked', () => {
      render(<TransferDataGridFooter {...defaultProps} />);
      
      const addButton = screen.getByTestId('styled-button-add');
      fireEvent.click(addButton);
      
      expect(defaultProps.handleAddClick).toHaveBeenCalledTimes(1);
    });

    it('should open bulk delete modal when Delete button is clicked', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3] };
      render(<TransferDataGridFooter {...props} />);
      
      const deleteButton = screen.getByTestId('styled-button-delete');
      fireEvent.click(deleteButton);
      
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
    });

    it('should open copy modal when Copy button is clicked', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3] };
      render(<TransferDataGridFooter {...props} />);
      
      const copyButton = screen.getByTestId('styled-button-copy');
      fireEvent.click(copyButton);
      
      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
    });
  });

  describe('Modal Management', () => {
    it('should not render modals initially', () => {
      render(<TransferDataGridFooter {...defaultProps} />);
      
      expect(screen.queryByTestId('bulk-delete-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('copy-modal')).not.toBeInTheDocument();
    });

    it('should close bulk delete modal when close is triggered', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3] };
      render(<TransferDataGridFooter {...props} />);
      
      // Open modal
      fireEvent.click(screen.getByTestId('styled-button-delete'));
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
      
      // Close modal
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByTestId('bulk-delete-modal')).not.toBeInTheDocument();
    });

    it('should close copy modal when close is triggered', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3] };
      render(<TransferDataGridFooter {...props} />);
      
      // Open modal
      fireEvent.click(screen.getByTestId('styled-button-copy'));
      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
      
      // Close modal
      fireEvent.click(screen.getByText('Close'));
      expect(screen.queryByTestId('copy-modal')).not.toBeInTheDocument();
    });

    it('should pass correct props to TransferBulkDeleteModal', () => {
      const props = { 
        ...defaultProps, 
        selectedRows: [1, 2, 3],
        apiUrl: '/api/test',
        transferType: 2
      };
      render(<TransferDataGridFooter {...props} />);
      
      fireEvent.click(screen.getByTestId('styled-button-delete'));
      
      expect(screen.getByTestId('bulk-delete-api-url')).toHaveTextContent('/api/test');
      expect(screen.getByTestId('bulk-delete-transfer-type')).toHaveTextContent('2');
      expect(screen.getByTestId('bulk-delete-selected-rows')).toHaveTextContent('1,2,3');
    });

    it('should pass correct props to TransferCopyModal', () => {
      const props = { 
        ...defaultProps, 
        selectedRows: [4, 5, 6],
        apiUrl: '/api/copy-test',
        transferType: 3
      };
      render(<TransferDataGridFooter {...props} />);
      
      fireEvent.click(screen.getByTestId('styled-button-copy'));
      
      expect(screen.getByTestId('copy-api-url')).toHaveTextContent('/api/copy-test');
      expect(screen.getByTestId('copy-transfer-type')).toHaveTextContent('3');
      expect(screen.getByTestId('copy-selected-rows')).toHaveTextContent('4,5,6');
    });
  });

  describe('GridPagination Props', () => {
    it('should render GridPagination component', () => {
      const paginationProps = {
        ...defaultProps,
        page: 5,
        rowsPerPage: 25,
        rowCount: 250
      };
      
      render(<TransferDataGridFooter {...paginationProps} />);
      
      expect(screen.getByTestId('grid-pagination')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty selectedRows array', () => {
      const props = { ...defaultProps, selectedRows: [] };
      render(<TransferDataGridFooter {...props} />);
      
      expect(screen.getByTestId('styled-button-add')).toBeInTheDocument();
      expect(screen.queryByTestId('styled-button-delete')).not.toBeInTheDocument();
      expect(screen.queryByTestId('styled-button-copy')).not.toBeInTheDocument();
    });

    it('should handle single selected row', () => {
      const props = { ...defaultProps, selectedRows: [1] };
      render(<TransferDataGridFooter {...props} />);
      
      expect(screen.queryByTestId('styled-button-add')).not.toBeInTheDocument();
      expect(screen.getByTestId('styled-button-delete')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-copy')).toBeInTheDocument();
    });

    it('should handle multiple selected rows', () => {
      const props = { ...defaultProps, selectedRows: [1, 2, 3, 4, 5] };
      render(<TransferDataGridFooter {...props} />);
      
      expect(screen.queryByTestId('styled-button-add')).not.toBeInTheDocument();
      expect(screen.getByTestId('styled-button-delete')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-copy')).toBeInTheDocument();
    });

    it('should handle undefined apiUrl gracefully', () => {
      const props = { ...defaultProps, apiUrl: undefined, selectedRows: [1] };
      render(<TransferDataGridFooter {...props} />);
      
      fireEvent.click(screen.getByTestId('styled-button-delete'));
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
    });

    it('should handle null transferType gracefully', () => {
      const props = { ...defaultProps, transferType: null, selectedRows: [1] };
      render(<TransferDataGridFooter {...props} />);
      
      fireEvent.click(screen.getByTestId('styled-button-copy'));
      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
    });
  });

  describe('UI State Transitions', () => {
    it('should toggle between Add and Delete/Copy buttons based on selection', () => {
      const { rerender } = render(<TransferDataGridFooter {...defaultProps} />);
      
      // Initially no selection - should show Add
      expect(screen.getByTestId('styled-button-add')).toBeInTheDocument();
      expect(screen.queryByTestId('styled-button-delete')).not.toBeInTheDocument();
      
      // Select rows - should show Delete and Copy
      rerender(<TransferDataGridFooter {...defaultProps} selectedRows={[1, 2]} />);
      expect(screen.queryByTestId('styled-button-add')).not.toBeInTheDocument();
      expect(screen.getByTestId('styled-button-delete')).toBeInTheDocument();
      expect(screen.getByTestId('styled-button-copy')).toBeInTheDocument();
      
      // Deselect rows - should show Add again
      rerender(<TransferDataGridFooter {...defaultProps} selectedRows={[]} />);
      expect(screen.getByTestId('styled-button-add')).toBeInTheDocument();
      expect(screen.queryByTestId('styled-button-delete')).not.toBeInTheDocument();
    });

    it('should maintain modal state independently', () => {
      const props = { ...defaultProps, selectedRows: [1, 2] };
      render(<TransferDataGridFooter {...props} />);
      
      // Open both modals sequentially
      fireEvent.click(screen.getByTestId('styled-button-delete'));
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId('styled-button-copy'));
      expect(screen.getByTestId('copy-modal')).toBeInTheDocument();
      expect(screen.getByTestId('bulk-delete-modal')).toBeInTheDocument();
    });
  });
});