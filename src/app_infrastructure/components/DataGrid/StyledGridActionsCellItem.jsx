import { GridActionsCellItem } from "@mui/x-data-grid";
const { default: styled } = require("styled-components");

const StyledGridActionsCellItem = styled(GridActionsCellItem)(() => ({
    "& .MuiSvgIcon-root": { color: "#252525" }
}));

export default StyledGridActionsCellItem;