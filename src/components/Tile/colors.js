export const colors = {
  a: 'blue',
  b: 'red',
  c: 'green',
  d: 'brown',
  e: 'purple',
  f: 'orange',
  g: 'yellow',
  h: 'aqua',
  i: 'blueviolet',
  j: 'cadetblue',
  k: 'coral',
  l: 'cornflowerblue',
  m: 'crimson',
  n: 'cyan',
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
  6: 'turquoise',
  7: 'springgreen',
  8: 'papayawhip',
  9: 'olivedrab'
}

const color = (key) => {
  return colors[String(key).toLowerCase()]
}

export default color
