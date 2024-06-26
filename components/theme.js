import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const colors = {

  primary: '#ffffff',
  primaryBis: '#f1f1f1',
  secondary:'#1c1c1c',
  lightGray: '#b2b2b2',
  darkblue: '#00407A',
  lightblue:'#4A90E2',
  lightGreen: '#3CB371',
  darkGreen: '#2E8B57',

};


export const shadow = {
  light: {
    shadowColor: colors.black,
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  dark: {
    shadowColor: colors.black,
    shadowRadius: 4,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
};

export const sizes = {
  width,
  height,
  title: 32,
  h1:28,
  h2: 24,
  h3: 18,
  h4: 14,
  h5: 12,
  body: 14,
  radius: 16,
  gauge: 8,
};

export const spacing = {
  s: 8,
  m: 18,
  l: 24,
  xl: 40,
};