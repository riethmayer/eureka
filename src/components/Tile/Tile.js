import React, { Component } from 'react'

class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  color(key) {
    const colors = {
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
      3: 'thistle',
      4: 'teal',
      5: 'wheat',
      6: 'turquoise',
      7: 'springgreen',
      8: 'papayawhip',
      9: 'olivedrab'
    }
    return colors[String(key).toLowerCase()]
  }

  render() {
    const { token,
            active,
            layer,
            column,
            row,
            onClick } = this.props
    let className = [
      'tile',
      `tile-${String(token).toLowerCase()}`,
      `layer-${layer}`,
      `column-${column}`,
      `row-${row}`
    ].join(" ")
    return (
      <svg xmlns="http//www.w3.org/2000/svg"
      fill="gray"
      stroke="none"
      height="40"
      width="40"
      onClick={onClick}
      className={`${className}`}>
      <rect width={39}
              height={39}
              x={1} y={1}
              fill={ 'lightgrey' }
              strokeWidth={'1'}
              stroke={ active ? 'black' : '#cccccc' } />
        <rect width={36}
              height={36}
              x={2} y={2}
              fill={ active ? '#efefef' : 'lightgrey' }
              strokeWidth={'1'}
              stroke={ active ? '#666666' : '#efefef' } />
        <text x="50%" y="60%"
              stroke={ '#dddddd' }
              strokeWidth='1'
              alignmentBaseline="middle" textAnchor="middle" fontFamily="Verdana"
              fontWeight="bold"
              fontSize="36" fill={this.color(token) || 'white'}>
          { token || 'nil' }
        </text>
      </svg>
    )
  }
}

export default Tile
