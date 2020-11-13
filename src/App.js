import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const axios = require('axios');
const { log } = console;

// refer => https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors/43268098#43268098
// https://github.com/Rob--W/cors-anywhere/
var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = 'https://app-money.tmx.com/graphql'

const getStocksConfig = (stocksList) => {
  const data = JSON.stringify({
    "operationName": "getQuoteForSymbols",
    "variables":{
      "symbols": stocksList
    },
    "query": "query getQuoteForSymbols($symbols: [String]) {\n  getQuoteForSymbols(symbols: $symbols) {\n    symbol\n    longname\n    price\n    volume\n    openPrice\n    priceChange\n    percentChange\n    dayHigh\n    dayLow\n    prevClose\n    __typename\n  }\n}\n"
  });

  return {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data
  };
};

const getRealtimeData = async (stocksList) => {
  try {
    const response = await axios(proxyUrl + targetUrl, getStocksConfig(stocksList));
    return response["data"]["data"]["getQuoteForSymbols"];
  }
  catch (err) {
    log(err);
    return [];
  }
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

// const useStyles = makeStyles({
//   table: {
//     minWidth: 700,
//   },
// });

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stocks: [] };
  }

  async componentDidMount() {
    // this.setState({ stocks: [] });
    let stocks = await getRealtimeData(["SHOP", "VRE", "ZRE"]);
    this.setState({ stocks });
  }

  render() {
    let { stocks } = this.state;
    return (
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Ticker</StyledTableCell>
              <StyledTableCell align="right">Company</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">% Change</StyledTableCell>
              <StyledTableCell align="right">Volume</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock) => (
              <StyledTableRow key={stock.symbol}>
                <StyledTableCell component="th" scope="row">
                  {stock.symbol}
                </StyledTableCell>
                <StyledTableCell align="right">{stock.longname}</StyledTableCell>
                <StyledTableCell align="right">{stock.price}</StyledTableCell>
                <StyledTableCell align="right">{stock.percentChange}</StyledTableCell>
                <StyledTableCell align="right">{stock.volume}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default App;
