const colors = {
  white: '#ffffff',
  lightGray: '#F7F8FE',
  black: '#31323B',
  teal: '#4FCACF',
  lightBlue: '#55A0F8',
};

const spacing = {
  xsmall: '0.5rem',
  small: '1rem',
  medium: '2rem',
  large: '4rem',
  xlarge: '6rem',
};

const fontSizing = {
  medium: '2rem',
  large: '3rem',
  xlarge: '4rem',
}

const theme = {
  primaryTextColor: colors.black,
  contrastTextcolor: colors.white,
  calculatorBackgroundColor: colors.white,
  buttonBackgroundColor: `linear-gradient(-90deg, ${colors.teal} 0%, ${colors.lightBlue} 98%)`,
  boxShadow: '0 2px 14px 4px rgba(52,63,134,0.60)',
  labelBackgroundColor: colors.lightGray, 
};

export {
  spacing,
  theme,
  fontSizing,
};