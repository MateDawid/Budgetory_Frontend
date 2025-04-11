import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";

const StyledTextField = styled(TextField)(({theme}) => ({
    variant: "outlined",
    marginBottom: theme.spacing(2),
}));

export default StyledTextField;
