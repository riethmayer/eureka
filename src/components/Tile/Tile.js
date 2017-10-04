import React, { Component } from 'react'

class Tile extends Component {
  render() {
    const { color, caption, active } = this.props
    return (
      <svg xmlns="http//www.w3.org/2000/svg" fill="gray" stroke="none" height="40" width="40">
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
              fontSize="36" fill={color || 'white'}>
          { caption || 'nil' }
        </text>
      </svg>
    )
  }
}

export default Tile
