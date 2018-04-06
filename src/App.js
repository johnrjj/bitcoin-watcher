import React, { Component } from 'react';
import styled from 'styled-components';
import { Display } from './components/Display';

const BASE_ENDPOINT = 'https://api.gdax.com';
const getBitcoinPriceData = async (pair = 'btc-usd') => {
  const endpoint = `${BASE_ENDPOINT}/products/${pair}/ticker`;
  const bitcoinPriceData = await fetch(endpoint);
  return bitcoinPriceData;
}

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  /* flex: 1; */
  height: 8rem;

`;

const BaseCurrencyContainer = styled.div`
  display: flex;
  height: 8rem;
`;

const BaseCurrencyValue = styled.input`
  line-height: 6rem;
  border: 1px solid #CCC;
  font-size: 4rem;
  padding: 0.5rem 1rem;
  border: 1px solid #CCC;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: inset 0 0 0.125em 0 rgba(0,0,0,.125);
  font-weight: 300;
  :focus {
    outline: none;
  }
`;

const BaseCurrencyLabel = styled.button`
  display: inline-block;
  height: 100%;
  background: #F4F4F4;
  color: rgba(0,0,0,1);
  text-decoration: none;
  border: 1px solid #CCC;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: inset 0 0 0.125em 0 rgba(0,0,0,.125);
  
`;

const EqualsContainer = styled.span`

`;

const QuoteCurrencyContainer = styled.div`
  display: flex;
  height: 8rem;
`;

const QuoteCurrencyValue = styled.input`
  line-height: 6rem;
  border: 1px solid #CCC;
  font-size: 4rem;
  padding: 0.5rem 1rem;
  border: 1px solid #CCC;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: inset 0 0 0.125em 0 rgba(0,0,0,.125);
  font-weight: 300;
  :focus {
    outline: none;
  }
`;

const QuoteCurrencyLabel = styled.button`
  display: inline-block;
  height: 6rem;
  background: #F4F4F4;
  color: rgba(0,0,0,1);
  text-decoration: none;
  border: 1px solid #CCC;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: inset 0 0 0.125em 0 rgba(0,0,0,.125);
  
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      price: null,
      baseCurrency: 'btc',
      quoteCurrency: 'usd',
      activeCurrency: 'base',
      baseAmountValue: '1',
      quoteAmountValue: null,
    }
  }

  async componentDidMount() {
    const res = await getBitcoinPriceData();
    const { price } = await res.json();
    this.setState({ price });

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
    
    
    console.log(calculatedQuoteAmount)
    console.log(calculatedBaseAmount);


    return (
      <AppContainer>
        <Row>
        <BaseCurrencyContainer>
          <BaseCurrencyValue
            value={calculatedBaseAmount}
            onChange={this.handleBaseAmountValueChange}/>
          <BaseCurrencyLabel>
            BTC
          </BaseCurrencyLabel>
        </BaseCurrencyContainer>
        <EqualsContainer>=</EqualsContainer>
        <QuoteCurrencyContainer>
          <QuoteCurrencyValue
            value={calculatedQuoteAmount}
            onChange={this.handleQuoteAmountValueChange}/>
          <QuoteCurrencyLabel>
            USD
          </QuoteCurrencyLabel>
        </QuoteCurrencyContainer>
        </Row>
      </AppContainer>
    );
  }
}

const calculateQuoteFromBase = (quotePrice, baseQuantity) => {
  return +quotePrice * +baseQuantity;
}

const calculateBaseFromQuote = (quotePrice, quoteQuantity) => {
  return +quoteQuantity / +quotePrice;
}


export default App;
