import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";

const StyledButton = styled(Button)({
    backgroundColor: "#FFFFFF",
    color: "#BD0000",
    borderColor: "#BD0000",
    '&:hover': {
        backgroundColor: "#BD0000",
        color: "#FFFFFF",
        borderColor: "#FFFFFF"
    },
})

export default StyledButton;