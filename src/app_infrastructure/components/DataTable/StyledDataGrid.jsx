const { DataGrid } = require("@mui/x-data-grid");
const { default: styled } = require("styled-components");

const StyledDataGrid = styled(DataGrid)(() => ({
    minWidth: "100%",
    maxWidth: "100%",
    border: 0,
    '& .MuiDataGrid-columnHeaderTitle, .MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-displayedRows': { fontWeight: 'bold', },
    '& .MuiDataGrid-cell': {
        borderRight: '1px solid #303030',
        borderRightColor: '#f0f0f0',
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell, .MuiDataGrid-footerContainer': {
        borderBottom: '#f0f0f0'
    },
}));

export default StyledDataGrid;