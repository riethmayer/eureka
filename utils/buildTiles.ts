const numbers_0_to_9: Array<string> = [...Array(10)].map((_, i) => String(i))
const alphabet: Array<string> = [...Array(26)].map((_, i) => String.fromCharCode(i+65))
const tokens = numbers_0_to_9.concat(alphabet)
const allTokens = tokens.concat(tokens).concat(tokens).concat(tokens)
const shuffle = (array: Array<string>): Array<string> => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export type Tile = {
  layer: number;
  row: number;
  column: number;
}

export type Token = {
  token: string;
  active: boolean;
}

export type TokenTile = Tile & Token;
export type TokenTileMap = Record<number, TokenTile>

const tileConfig : Record<number, Tile> = {
   0:  { layer: 0, row: 0, column: 1 },
   1:  { layer: 0, row: 0, column: 2 },
   2:  { layer: 0, row: 0, column: 3 },
   3:  { layer: 0, row: 0, column: 4 },
   4:  { layer: 0, row: 0, column: 5 },
   5:  { layer: 0, row: 0, column: 6 },
   6:  { layer: 0, row: 0, column: 7 },
   7:  { layer: 0, row: 0, column: 8 },
   8:  { layer: 0, row: 0, column: 9 },
   9:  { layer: 0, row: 0, column: 10 },
  10:  { layer: 0, row: 0, column: 11 },
  11:  { layer: 0, row: 0, column: 12 },
  12:  { layer: 0, row: 1, column: 3 },
  13:  { layer: 0, row: 1, column: 4 },
  14:  { layer: 0, row: 1, column: 5 },
  15:  { layer: 0, row: 1, column: 6 },
  16:  { layer: 0, row: 1, column: 7 },
  17:  { layer: 0, row: 1, column: 8 },
  18:  { layer: 0, row: 1, column: 9 },
  19:  { layer: 0, row: 1, column: 10 },
  20:  { layer: 0, row: 2, column: 2 },
  21:  { layer: 0, row: 2, column: 3 },
  22:  { layer: 0, row: 2, column: 4 },
  23:  { layer: 0, row: 2, column: 5 },
  24:  { layer: 0, row: 2, column: 6 },
  25:  { layer: 0, row: 2, column: 7 },
  26:  { layer: 0, row: 2, column: 8 },
  27:  { layer: 0, row: 2, column: 9 },
  28:  { layer: 0, row: 2, column: 10 },
  29:  { layer: 0, row: 2, column: 11 },
  30:  { layer: 0, row: 3, column: 1 },
  31:  { layer: 0, row: 3, column: 2 },
  32:  { layer: 0, row: 3, column: 3 },
  33:  { layer: 0, row: 3, column: 4 },
  34:  { layer: 0, row: 3, column: 5 },
  35:  { layer: 0, row: 3, column: 6 },
  36:  { layer: 0, row: 3, column: 7 },
  37:  { layer: 0, row: 3, column: 8 },
  38:  { layer: 0, row: 3, column: 9 },
  39:  { layer: 0, row: 3, column: 10 },
  40:  { layer: 0, row: 3, column: 11 },
  41:  { layer: 0, row: 3, column: 12 },
  42:  { layer: 6, row: 4, column: 0 },
  43:  { layer: 0, row: 5, column: 1 },
  44:  { layer: 0, row: 5, column: 2 },
  45:  { layer: 0, row: 5, column: 3 },
  46:  { layer: 0, row: 5, column: 4 },
  47:  { layer: 0, row: 5, column: 5 },
  48:  { layer: 0, row: 5, column: 6 },
  49:  { layer: 0, row: 5, column: 7 },
  50:  { layer: 0, row: 5, column: 8 },
  51:  { layer: 0, row: 5, column: 9 },
  52:  { layer: 0, row: 5, column: 10 },
  53:  { layer: 0, row: 5, column: 11 },
  54:  { layer: 0, row: 5, column: 12 },
  55:  { layer: 0, row: 6, column: 13 },
  56:  { layer: 0, row: 6, column: 14 },
  57:  { layer: 0, row: 7, column: 2 },
  58:  { layer: 0, row: 7, column: 3 },
  59:  { layer: 0, row: 7, column: 4 },
  60:  { layer: 0, row: 7, column: 5 },
  61:  { layer: 0, row: 7, column: 6 },
  62:  { layer: 0, row: 7, column: 7 },
  63:  { layer: 0, row: 7, column: 8 },
  64:  { layer: 0, row: 7, column: 9 },
  65:  { layer: 0, row: 7, column: 10 },
  66:  { layer: 0, row: 7, column: 11 },
  67:  { layer: 0, row: 8, column: 3 },
  68:  { layer: 0, row: 8, column: 4 },
  69:  { layer: 0, row: 8, column: 5 },
  70:  { layer: 0, row: 8, column: 6 },
  71:  { layer: 0, row: 8, column: 7 },
  72:  { layer: 0, row: 8, column: 8 },
  73:  { layer: 0, row: 8, column: 9 },
  74:  { layer: 0, row: 8, column: 10 },
  75:  { layer: 0, row: 9, column: 1 },
  76:  { layer: 0, row: 9, column: 2 },
  77:  { layer: 0, row: 9, column: 3 },
  78:  { layer: 0, row: 9, column: 4 },
  79:  { layer: 0, row: 9, column: 5 },
  80:  { layer: 0, row: 9, column: 6 },
  81:  { layer: 0, row: 9, column: 7 },
  82:  { layer: 0, row: 9, column: 8 },
  83:  { layer: 0, row: 9, column: 9 },
  84:  { layer: 0, row: 9, column: 10 },
  85:  { layer: 0, row: 9, column: 11 },
  86:  { layer: 0, row: 9, column: 12 },
  87:  { layer: 1, row: 10, column: 4 },
  88:  { layer: 1, row: 10, column: 5 },
  89:  { layer: 1, row: 10, column: 6 },
  90:  { layer: 1, row: 10, column: 7 },
  91:  { layer: 1, row: 10, column: 8 },
  92:  { layer: 1, row: 10, column: 9 },
  93:  { layer: 1, row: 11, column: 4 },
  94:  { layer: 1, row: 11, column: 5 },
  95:  { layer: 1, row: 11, column: 6 },
  96:  { layer: 1, row: 11, column: 7 },
  97:  { layer: 1, row: 11, column: 8 },
  98:  { layer: 1, row: 11, column: 9 },
  99:  { layer: 1, row: 12, column: 4 },
  100: { layer: 1, row: 12, column: 5 },
  101: { layer: 1, row: 12, column: 6 },
  102: { layer: 1, row: 12, column: 7 },
  103: { layer: 1, row: 12, column: 8 },
  104: { layer: 1, row: 12, column: 9 },
  105: { layer: 1, row: 13, column: 4 },
  106: { layer: 1, row: 13, column: 5 },
  107: { layer: 1, row: 13, column: 6 },
  108: { layer: 1, row: 13, column: 7 },
  109: { layer: 1, row: 13, column: 8 },
  110: { layer: 1, row: 13, column: 9 },
  111: { layer: 1, row: 14, column: 4 },
  112: { layer: 1, row: 14, column: 5 },
  113: { layer: 1, row: 14, column: 6 },
  114: { layer: 1, row: 14, column: 7 },
  115: { layer: 1, row: 14, column: 8 },
  116: { layer: 1, row: 14, column: 9 },
  117: { layer: 1, row: 15, column: 4 },
  118: { layer: 1, row: 15, column: 5 },
  119: { layer: 1, row: 15, column: 6 },
  120: { layer: 1, row: 15, column: 7 },
  121: { layer: 1, row: 15, column: 8 },
  122: { layer: 1, row: 15, column: 9 },
  123: { layer: 2, row: 16, column: 5 },
  124: { layer: 2, row: 16, column: 6 },
  125: { layer: 2, row: 16, column: 7 },
  126: { layer: 2, row: 16, column: 8 },
  127: { layer: 2, row: 17, column: 5 },
  128: { layer: 2, row: 17, column: 6 },
  129: { layer: 2, row: 17, column: 7 },
  130: { layer: 2, row: 17, column: 8 },
  131: { layer: 2, row: 18, column: 5 },
  132: { layer: 2, row: 18, column: 6 },
  133: { layer: 2, row: 18, column: 7 },
  134: { layer: 2, row: 18, column: 8 },
  135: { layer: 2, row: 19, column: 5 },
  136: { layer: 2, row: 19, column: 6 },
  137: { layer: 2, row: 19, column: 7 },
  138: { layer: 2, row: 19, column: 8 },
  139: { layer: 3, row: 20, column: 6 },
  140: { layer: 3, row: 20, column: 7 },
  141: { layer: 3, row: 21, column: 6 },
  142: { layer: 3, row: 21, column: 7 },
  143: { layer: 4, row: 22, column: 15 },
} as const;


export const buildTiles = (): TokenTileMap => {
  const result: TokenTileMap = {};
  return shuffle(allTokens)
    .map((token, index) => [token, index])
    .reduce((acc, [token, index]) => {
      acc[index]= {
        ...tileConfig[index],
        active: false,
        index,
        token,
      }
      return(acc)
    }, result)
}

export default buildTiles
