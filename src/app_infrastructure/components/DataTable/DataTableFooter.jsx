import React, {useEffect} from 'react';
import {GridPagination} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StyledButton from "../StyledButton";

/**
 * DataTableFooterButtons component that displays buttons basing on selected rows.
 * @param {function} handleAddClick - Function to handle Add button click.
 * @param {array} selectedRows - Array containing ids of selected rows.
 */
const DataTableFooterButtons = ({handleAddClick, selectedRows}) => {
    /**
     * Used to rerender component on rows selection.
     */
    useEffect(() => {}, [selectedRows]);

    /**
     * Function to handle clicking "Delete selected" toolbar button.
     */
    const handleDeleteSelectedClick = () => {
        // TODO: Bulk delete on API side
        console.log(`DELETE ROWS: ${selectedRows}`)
    };

    return <>
        {selectedRows > 0 ?
            <StyledButton variant="outlined" startIcon={<DeleteIcon/>} onClick={handleDeleteSelectedClick}
                          sx={{marginLeft: 1}}>
                Delete selected
            </StyledButton> :
            <StyledButton variant="outlined" startIcon={<AddIcon/>} onClick={handleAddClick} sx={{marginLeft: 1}}>
                Add
            </StyledButton>
        }
    </>

}


/**
 * DataTableFooter component for DataTable custom footer.
 * @param {function} handleAddClick - Function to handle Add button click.
 * @param {array} selectedRows - Array containing ids of selected rows.
 * @param {object} props - Other properties.
 */
const DataTableFooter = ({handleAddClick, selectedRows, ...props}) => {
    return <>
        <DataTableFooterButtons handleAddClick={handleAddClick} selectedRows={selectedRows}/>
        <GridPagination {...props} />
    </>
}

export default DataTableFooter;