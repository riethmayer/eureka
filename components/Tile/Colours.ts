import { Token } from '@store/gameBoard'

export const colors: Record<Token, string> = {
  "A": 'blue',
  "B": 'red',
  "C": 'green',
  "D": 'brown',
  "E": 'purple',
  "F": 'orange',
  "G": 'yellow',
  "H": 'royalblue',
  "I": 'blueviolet',
  "J": 'cadetblue',
  "K": 'coral',
  "L": 'cornflowerblue',
  "M": 'crimson',
  "N": 'rebeccapurple',
  "O": 'darkblue',
  "P": 'darkcyan',
  "Q": 'darkgreen',
  "R": 'darksalmon',
  "S": 'deepskyblue',
  "T": 'deeppink',
  "U": 'yellow',
  "V": 'forestgreen',
  "W": 'greenyellow',
  "X": 'palevioletred',
  "Y": 'darkseagreen',
  "Z": 'tomato',
  "0": 'orchid',
  "1": 'peru',
  "2": 'steelblue',
  "3": 'darkbrown',
  "4": 'teal',
  "5": 'wheat',
  "6": 'firebrick',
  "7": 'springgreen',
  "8": 'darkslategray',
  "9": 'olivedrab'
} as const;

export type ColourType = typeof colors[Token];
export const colour = (key: Token) => (colors[key]);
export default colour;
