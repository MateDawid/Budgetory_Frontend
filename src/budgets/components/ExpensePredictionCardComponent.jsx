import { Card, Collapse, CardContent, Typography, IconButton, Grid } from "@mui/material"
import React, { useContext, useState } from "react";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PercentageProgressWithLabel } from "./PercentageProgressWithLabel";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import { BudgetContext } from "../../app_infrastructure/components/BudgetContext";

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

export const ExpensePredictionCardComponent = ({ prediction }) => {
    const { contextBudgetCurrency } = useContext(BudgetContext);
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card variant="outlined" sx={{ marginTop: 2, borderColor: "#D0D0D0" }}>
            <Grid container spacing={2} mt={1} mb={1} ml={2} mr={2} sx={{
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Grid size={1} display="flex" justifyContent="left" alignItems="center">
                    <Typography>{prediction.category_owner}</Typography>
                </Grid>
                <Grid size={2} display="flex" justifyContent="left" alignItems="center">
                    <Typography>{prediction.category_display}</Typography>
                </Grid>
                <Grid size={4} display="flex" justifyContent="center" alignItems="center">
                    <Table
                        size="small"
                        sx={{
                            border: '1px solid #D0D0D0',
                            '& th, & td': {
                                border: '1px solid #D0D0D0'
                            }
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {prediction.initial_value && <TableCell align="center"><b>Initial plan</b></TableCell>}
                                <TableCell align="center" ><b>Current plan</b></TableCell>
                                <TableCell align="center"><b>Spent</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {prediction.initial_value && <TableCell align="center">{prediction.initial_value} {contextBudgetCurrency}</TableCell>}
                                <TableCell align="center">{prediction.current_value} {contextBudgetCurrency}</TableCell>
                                <TableCell align="center">100 {contextBudgetCurrency}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid size={3} display="flex" justifyContent="center" alignItems="center">
                    <PercentageProgressWithLabel currentValue={3} maxValue={7} />
                </Grid>
                <Grid size={1} display="flex" justifyContent="right" alignItems="center">
                    {prediction.description &&
                        <ExpandMoreButton expand={expanded} onClick={handleExpandClick}>
                            <ExpandMoreIcon />
                        </ExpandMoreButton>}
                    <IconButton><EditIcon /></IconButton> 
                    <IconButton><DeleteIcon /></IconButton>
                </Grid>
            </Grid>

            <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ border: "#D0D0D0" }}>
                <CardContent>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>{prediction.description}</Typography>
                </CardContent>
            </Collapse>
        </Card >
    )
}