import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableRow, TableCell, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function WalletsSummaryTable({ wallets }) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} style={{ paddingTop: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width="40%" sx={{ fontWeight: 'bold' }} align="center">
              Wallet
            </TableCell>
            <TableCell width="20%" sx={{ fontWeight: 'bold' }} align="center">
              Currency
            </TableCell>
            <TableCell width="20%" sx={{ fontWeight: 'bold' }} align="center">
              Deposits
            </TableCell>
            <TableCell width="25%" sx={{ fontWeight: 'bold' }} align="center">
              Balance
            </TableCell>
            <TableCell
              width="5%"
              sx={{ fontWeight: 'bold' }}
              align="center"
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wallets.map((row) => (
            <TableRow key={row.id}>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.currency_name}</TableCell>
              <TableCell align="center">{row.deposits_count}</TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: 'bold',
                  color: row.balance < 0 ? '#BD0000' : '#008000',
                }}
              >
                {row.balance} {row.currency_name}
              </TableCell>

              <TableCell align="center" size="small">
                <IconButton onClick={() => navigate(`/wallets/${row.id}`)}>
                  <OpenInNewIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
