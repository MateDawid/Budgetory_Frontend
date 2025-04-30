import {Box, Card, CardActions, CardHeader, Stack, Chip, Divider} from "@mui/material";
import PageviewIcon from '@mui/icons-material/Pageview';
import React from "react";
import {Link} from 'react-router-dom';
import StyledButton from "../../app_infrastructure/components/StyledButton";
import truncateText from "../../app_infrastructure/utils/truncateText";
import DeleteButton from "../../app_infrastructure/components/DeleteButton";

/**
 * EntityCard component to display single Entity card on Budgets list.
 * @param {string} apiUrl - Base API url to be called with DELETE method.
 * @param {object} object - Entity object.
 * @param {function|null} setDeletedObjectId - EntityList useState setter for refreshing Entity list on Entity removing.
 */
const EntityCard = ({apiUrl, object, setDeletedObjectId}) => {
    return (
        <Card variant="outlined" sx={{marginTop: 2, borderColor: "#D0D0D0"}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <CardHeader title={truncateText(object.name, 18)}/>
                    <Chip label={object.is_active ? "🟢 Active" : "🔴 Inactive"} variant="outlined" />
                </Stack>
                <Divider sx={{width: "100%", mb: 1, mt: 1}}/>
                <CardActions sx={{width: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: 'space-around'}}>
                        <StyledButton component={Link} to={`/entities/${object.id}`} variant="outlined" startIcon={<PageviewIcon/>}>
                            View
                        </StyledButton>
                        <DeleteButton apiUrl={apiUrl} objectId={object.id} objectDisplayName="Entity" setDeletedObjectId={setDeletedObjectId}/>
                    </Box>
                </CardActions>
            </Box>
        </Card>
    )
}

export default EntityCard;