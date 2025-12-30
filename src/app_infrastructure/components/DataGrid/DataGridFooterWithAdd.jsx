import React from 'react';
import { GridPagination } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import StyledButton from '../StyledButton';

/**
 * DataTableFooter component for DataTable custom footer with Add button.
 * @param {object} props
 * @param {function} props.handleAddClick - Function to handle Add button click.
 * @param {object} props.props - Other properties.
 */
const DataGridFooterWithAdd = ({ handleAddClick, ...props }) => {
  return (
    <>
      <StyledButton
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        sx={{ marginLeft: 1 }}
      >
        Add
      </StyledButton>
      <GridPagination {...props} />
    </>
  );
};

export default DataGridFooterWithAdd;
