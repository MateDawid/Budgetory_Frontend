import * as React from "react";
import { Box, Card, List, Divider } from "@mui/material";
import RightbarItem from "./RightbarItem"
import BudgetSelector from "./BudgetSelector";
import { useContext, useEffect, useState } from "react";
import { BudgetContext } from "../store/BudgetContext";
import { AlertContext } from "../store/AlertContext";
import { getApiObjectsList } from "../services/APIService";


/**
 * Rightbar component to display BudgetSelector and Deposits balances on right side of screen
 */
const Rightbar = () => {
    const { setAlert } = useContext(AlertContext);
    const { contextBudgetId, refreshTimestamp } = useContext(BudgetContext);
    const [deposits, setDeposits] = useState([])

    useEffect(() => {
        const loadBudgetDeposits = async () => {
            if (!contextBudgetId || ['/login', '/register'].includes(window.location.pathname)) {
                setAlert(null);
                return
            }
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`)
                setDeposits(response);
            } catch (error) {
                console.error(error)
                setDeposits([])
            }
        }
        loadBudgetDeposits();
    }, [contextBudgetId, refreshTimestamp])

    return (
        <Box width={240} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Box position="fixed" width={240} pt={2} display="flex" justifyContent="center">
                <Card>
                    <Box width={220} display="flex" flexDirection="column" alignItems="center" pt={2}>
                        <BudgetSelector />
                        <Divider variant="middle" />
                        <List sx={{ width: "100%" }}>
                            {deposits.map(deposit => (
                                <RightbarItem key={deposit.id} deposit={deposit} />
                            ))}
                        </List>
                    </Box>
                </Card>

            </Box>
        </Box>
    )
}

export default Rightbar;