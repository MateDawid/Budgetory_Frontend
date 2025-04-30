import {Box, Card, CardActions, CardHeader, Stack, Chip, Typography, Divider} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import truncateText from "../../app_infrastructure/utils/truncateText";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";

/**
 * TransferCategoryCard component to display single TransferCategory card on TransferCategories list.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {object} object - TransferCategory object.
 * @param {function|null} setDeletedObjectId - TransferCategoryList useState setter for refreshing TransferCategory list on TransferCategory removing.
 */
const TransferCategoryCard = ({apiUrl, object, setDeletedObjectId}) => {
    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <CardHeader title={truncateText(object.name, 18)}/>
                    <Chip label={object.is_active ? "🟢 Active" : "🔴 Inactive"} variant="outlined" />
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <Typography fontSize={12} color="primary">{object.owner_display}</Typography>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1} width="90%">
                    <Typography fontSize={12} color="secondary">{object.category_type_display}</Typography>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <Typography fontSize={12} color="secondary">{object.priority_display}</Typography>
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <CardActions sx={{width: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: 'space-around'}}>
                        <StyledButton component={Link} to={`/categories/${object.id}`} variant="outlined" startIcon={<PageviewIcon/>}>
                            View
                        </StyledButton>
                        <DeleteButton apiUrl={apiUrl} objectId={object.id} objectDisplayName="Transfer Category" setDeletedObjectId={setDeletedObjectId} isDisabled={object.status !== 1}/>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default TransferCategoryCard;