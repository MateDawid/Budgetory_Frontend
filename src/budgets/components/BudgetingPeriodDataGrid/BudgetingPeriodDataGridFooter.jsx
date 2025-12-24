import React from 'react';
import { GridPagination } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import StyledButton from '../../../app_infrastructure/components/StyledButton';

/**
 * BudgetingPeriodDataGridFooter component for DataTable custom footer.
 * @param {object} props
 * @param {function} props.handleAddClick - Function to handle Add button click.
 * @param {object} props.props - Other properties.
 */
const BudgetingPeriodDataGridFooter = ({ handleAddClick, ...props }) => {
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

export default BudgetingPeriodDataGridFooter;
