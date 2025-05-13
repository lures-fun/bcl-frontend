import { extendTheme } from '@chakra-ui/react';

const brand = {
  bclBlue: '#146C93',
  bclBgGlay: '#212121',
  bclBgBlue: '#2f3746',
  textBlack: '#18171C',
  borderGray: '#707070',
  inputBorderGray: '#484848',
  inputError: '#FF5CA1',
};
const breakpoints = {
  base: "0px",
  sm: "375px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
  "2xl": "1536px",
};

export const theme = extendTheme({
  styles: {},
  breakpoints,
  colors: {
    brand,
  },
  fonts: {
    body: `Hiragino Kaku Gothic Pro W3`,
  },
});

