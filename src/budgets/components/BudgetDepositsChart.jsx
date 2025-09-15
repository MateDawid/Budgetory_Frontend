import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState } from 'react';
import React from 'react';

const periods = ['2025_01', '2025_02', '2025_03'];
const depositTypes = ["💸 For daily expenses"
    , "💰 For savings"
    , "🪙 For investments"
    , "❔ Other"
]
const deposits = [
    { name: 'Deposit A', values: [0, 1000, 2000] },
    { name: 'Deposit B', values: [400, 200, 300] },
    { name: 'Deposit C', values: [800, 600, 900] },
    // ... more deposits
];

const colorPalette = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

const series = deposits.map((deposit, index) => ({
    data: deposit.values,
    label: deposit.name,
    valueFormatter: (value) => `${value.toString()} zł`,
    color: colorPalette[index % colorPalette.length]
}));

function SelectField({ choices, value, setValue, label }) {
    return (
        <TextField
            select
            label={label}
            value={value || ''}
            sx={{ minWidth: 130, mb: 2 }}
            onChange={(event) => setValue(event.target.value)}
        >
            {choices.map((choice) => (
                <MenuItem key={choice} value={choice}>
                    {choice}
                </MenuItem>
            ))}
        </TextField>
    )

}

export default function BudgetDepositsChart() {
    const [periodFrom, setPeriodFrom] = useState();
    const [periodTo, setPeriodTo] = useState();
    const [depositType, setDepositType] = useState();
    const [deposit, setDeposit] = useState();

    return (
        <Stack sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                    <SelectField
                        choices={periods}
                        label="Period from"
                        value={periodFrom || ''}
                        setValue={setPeriodFrom}
                    />
                    <SelectField
                        choices={periods}
                        label="Period to"
                        value={periodTo || ''}
                        setValue={setPeriodTo}
                    />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <SelectField
                        choices={depositTypes}
                        label="Deposit type"
                        value={depositType || ''}
                        setValue={setDepositType}
                    />
                    <SelectField
                        choices={deposits}
                        label="Deposit"
                        value={deposit || ''}
                        setValue={setDeposit}
                    />
                </Stack>

            </Stack>

            <LineChart
                xAxis={[{ scaleType: 'band', data: periods }]}
                series={series}
                height={300}
                margin={{ bottom: 10 }}
            />
        </Stack>
    );
}