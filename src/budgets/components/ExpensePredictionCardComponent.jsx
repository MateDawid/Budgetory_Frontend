import { Card, CardHeader, Collapse, CardContent, Typography, IconButton, Stack, Grid } from "@mui/material"
import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PercentageProgressWithLabel } from "./PercentageProgressWithLabel";


const ExpandMoreButton = styled((props) => {
    const { expand, ...other } = props; // eslint-disable-line no-unused-vars
    return <IconButton {...other} />;
})(({ theme }) => ({
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
    variants: [
        {
            props: ({ expand }) => !expand,
            style: {
                transform: 'rotate(0deg)',
            },
        },
        {
            props: ({ expand }) => !!expand,
            style: {
                transform: 'rotate(180deg)',
            },
        },
    ],
}));

export const ExpensePredictionCardComponent = () => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card variant="outlined" sx={{ marginTop: 2, borderColor: "#D0D0D0" }}>
            <Grid container spacing={2}>
                <Grid size={2}>
                    <Typography>📉 Food</Typography>
                </Grid>
                <Grid size={2}>
                    <Typography>Initial prediction: 100$</Typography>
                </Grid>
                <Grid size={2}>
                    <Typography>Current prediction: 100$</Typography>
                </Grid>
                <Grid size={2}>
                    <Typography>Spent: 100$</Typography>
                </Grid>
                <Grid size={2}>
                    <PercentageProgressWithLabel value={50} />
                </Grid>
                <Grid size={2}>
                    <ExpandMoreButton expand={expanded} onClick={handleExpandClick}>
                        <ExpandMoreIcon />
                    </ExpandMoreButton>
                </Grid>
            </Grid>

            <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ border: "#D0D0D0" }}>
                <CardContent>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                        {"Batony proteinowe - 2 x 60 zł = 120 zł\nOneDayMore - 200 zł\nJedzenie na mieście lub zamawiane - 250 zł"}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}