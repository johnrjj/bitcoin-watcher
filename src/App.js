import React, { Component } from 'react';
import styled from 'styled-components';
import { theme, spacing, fontSizing } from './theme';
import { BigNumber } from 'bignumber.js';
BigNumber.config({ ERRORS: false });

const BASE_ENDPOINT = 'https://api.gdax.com';
const getBitcoinPriceData = async (pair = 'btc-usd') => {
  const endpoint = `${BASE_ENDPOINT}/products/${pair}/ticker`;
  const bitcoinPriceData = await fetch(endpoint);
  return bitcoinPriceData;
}

const pairMetadata = {
  base: {
    label: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
  },
  quote: {
    label: 'USD',
    name: 'Dollar',
    decimals: 2,
  }
};

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BitcoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 42rem;
  padding: 1rem;
`;

const Header = styled.h1`
  font-size: ${fontSizing.large};
  font-weight: 500;
  color: ${theme.contrastTextcolor};
  margin-bottom: ${spacing.large};
  text-align: center;
`;

const CalculatorContainer = styled.div`
  background-color: ${theme.calculatorBackgroundColor};
  border-radius: 8px;
  width: 100%;
  box-shadow: ${theme.boxShadow};
  overflow: hidden;
  margin-bottom: ${spacing.xlarge};
  position: relative;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  height: 10rem;
  overflow: hidden;
  flex: 1;
`;

const RowLabel = styled.div`
  min-width: 12rem;
  font-size: ${fontSizing.large};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${theme.labelBackgroundColor};
`;

const RowInput = styled.input`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: ${fontSizing.xlarge};
  padding-left: ${spacing.medium};
  background-color: ${theme.calculatorBackgroundColor};
  color: ${theme.primaryTextColor};
  font-family: 'Lato';
  border: none;
  :focus {
   outline: none;
  }
`;

const Divider = styled.hr`
  border:0;
  border-top:1px solid #DADBE2;
  margin:0;height:1px;
`;

const Button = styled.button`
  width: 100%;
  height: 8rem;
  background: ${theme.buttonBackgroundColor};
  border: none;
  border-radius: 8px;
  font-size: ${fontSizing.medium};
  font-family: 'Lato';
  color: ${theme.contrastTextcolor};
  box-shadow: ${theme.boxShadow};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${spacing.small};
  transition: all 0.2s;
  :active {
    transform: scale3d(0.97, 0.97, 0.97);
    outline: none;
  }
  :focus {
    outline: none;
  }
`;

const ReverseContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 100%;
  height: 40px;
  width: 40px;
  background-color: blue;
`

class App extends Component {
  constructor() {
    super();
    this.state = {
      price: null,
      baseCurrencyName: 'Bitcoin',
      baseCurrencyTicker: 'BTC',
      quoteCurrencyTicker: 'USD',
      activeCurrency: 'base',
      baseAmountValue: '1',
      quoteAmountValue: null,
    }
  }

  async componentDidMount() {
    const res = await getBitcoinPriceData();
    const { price } = await res.json();
    this.setState({ price });

    setInterval(async () => {
      await this.updatePrice();
    }, 4000);
  }

  async updatePrice() {
    const res = await getBitcoinPriceData();
    const { price } = await res.json();
    this.setState({ price });
  }

  handleBaseAmountValueChange = (e) => {
    const val = e.target.value;
    this.setState({
      activeCurrency: 'base',
      baseAmountValue: val,
      quoteAmountValue: null,
    });
  }

  handleQuoteAmountValueChange = (e) => {
    const val = e.target.value;
    this.setState({
      activeCurrency: 'quote',
      baseAmountValue: null,
      quoteAmountValue: val,
    });
  }

  render() {
    const calculatedBaseAmount = this.state.activeCurrency === 'base'
      ? this.state.baseAmountValue
      : calculateBaseFromQuote(this.state.price, this.state.quoteAmountValue);
    const calculatedQuoteAmount = this.state.activeCurrency === 'quote'
      ? this.state.quoteAmountValue
      : calculateQuoteFromBase(this.state.price, this.state.baseAmountValue);

    return (
      <AppContainer>
        <BitcoinContainer>
          <Header>Simple <strong>{this.state.baseCurrencyName}</strong> Converter</Header>
          <CalculatorContainer>
            <Row>
              <RowLabel>{this.state.baseCurrencyTicker}</RowLabel>
              <RowInput
                value={calculatedBaseAmount}
                onChange={this.handleBaseAmountValueChange} />
            </Row>
            <ReverseContainer/>
            <Divider />
            <Row>
              <RowLabel>{this.state.quoteCurrencyTicker}</RowLabel>
              <RowInput
                value={calculatedQuoteAmount}
                onChange={this.handleQuoteAmountValueChange} />
            </Row>
          </CalculatorContainer>
          <Button>
            Buy {this.state.baseCurrencyName}
          </Button>
        </BitcoinContainer>
      </AppContainer>
    );
  }
}

const calculateQuoteFromBase = (quotePrice, baseQuantity, decimals = 2) => {
  if (!quotePrice) return ''
  if (!baseQuantity || baseQuantity == '') return '';
  return (new BigNumber(quotePrice).multipliedBy(new BigNumber(baseQuantity))).toFormat(decimals);

  // return new BigNumber(new String(+quotePrice * +baseQuantity)).toFixed(decimals);
}

const calculateBaseFromQuote = (quotePrice, quoteQuantity, decimals = 8) => {
  if (!quotePrice) return '';
  if (!quoteQuantity || quoteQuantity == '') return '';
  return new BigNumber(new BigNumber(quoteQuantity).dividedBy(new BigNumber(quotePrice))).toFormat(decimals);
}


export default App;
