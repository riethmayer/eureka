export const colors = {
  a: 'blue',
  b: 'red',
  c: 'green',
  d: 'brown',
  e: 'purple',
  f: 'orange',
  g: 'yellow',
  h: 'royalblue',
  i: 'blueviolet',
  j: 'cadetblue',
  k: 'coral',
  l: 'cornflowerblue',
  m: 'crimson',
  n: 'rebeccapurple',
  o: 'darkblue',
  p: 'darkcyan',
  q: 'darkgreen',
  r: 'darksalmon',
  s: 'deepskyblue',
  t: 'deeppink',
  u: 'yellow',
  v: 'forestgreen',
  w: 'greenyellow',
  x: 'palevioletred',
  y: 'darkseagreen',
  z: 'tomato',
  0: 'orchid',
  1: 'peru',
  2: 'steelblue',
  3: 'darkbrown',
  4: 'teal',
  5: 'wheat',
  6: 'firebrick',
  7: 'springgreen',
  8: 'darkslategray',
  9: 'olivedrab'
}

const color = (key) => {
  return colors[String(key).toLowerCase()]
}

export default color
