import * as React from "react";
import {Box, Card, List, Divider} from "@mui/material";
import RightbarItem from "./RightbarItem"
import BudgetSelector from "./BudgetSelector";
import {useContext, useEffect, useState} from "react";
import {getApiObjectsList} from "../services/APIService";
import {BudgetContext} from "./BudgetContext";
import {AlertContext} from "./AlertContext";


/**
 * Rightbar component to display BudgetSelector and Deposits balances on right side of screen
 */
const Rightbar = () => {
    const {contextBudgetId} = useContext(BudgetContext);
    const {setAlert} = useContext(AlertContext);
    const [deposits, setDeposits] = useState([]);

    /**
     * Fetches Context Budget Deposits from API.
     */
    useEffect(() => {
        const loadData = async () => {
            if (!contextBudgetId) {
                setDeposits([])
            }
            try {
                const response = await getApiObjectsList(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${contextBudgetId}/deposits/`)
                setDeposits(response);
            } catch (error) {
                console.error(error)
                setAlert({type: 'error', message: "Failed to load Budget Deposits on Rightbar."});
                setDeposits([])
            }
        }
        loadData();
    }, [contextBudgetId]);

    return (
        <Box width={240} sx={{display: {xs: "none", sm: "none", md: "block"}}}>
            <Box position="fixed" width={240} pt={2} display="flex" justifyContent="center">
                <Card>
                    <Box width={220} display="flex" flexDirection="column" alignItems="center" pt={2}>
                        <BudgetSelector />
                        <Divider variant="middle" />
                        <List sx={{width: "100%"}}>
                            {deposits.map(deposit => (
                                <RightbarItem key={deposit.id} deposit={deposit}/>
                            ))}
                        </List>
                    </Box>
                </Card>

            </Box>
        </Box>
    )
}

export default Rightbar;