/**
 * Function to prepare mapping of API ordering fields for DataTable columns other than column names.
 * @param {object} columns - DataTable columns definitions.
 * @return {object} - Mapping for sorting DataTable rows.
 */
const getSortFieldMapping = (columns) => {
  return columns.reduce((acc, column) => {
    if (column.sortField) {
      acc[column.field] = column.sortField;
    }
    return acc;
  }, {});
};

export default getSortFieldMapping;
