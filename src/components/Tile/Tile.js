import React, { Component } from 'react'
import _ from 'lodash'
import color from './colors'
import './tile.css'

class Tile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  classes = ({token, layer, column, row, active}) => {
    return _.compact([
      'tile',
      'rect',
      `layer-${layer}`,
      `column-${column}`,
      `row-${row}`,
      `${active ? 'active' : ''}`
    ]).join(" ")
  }

  render() {
    const { onClick, token } = this.props
    return (
      <div onClick={onClick}
           className={ this.classes(this.props) }>
        <svg xmlns="http//www.w3.org/2000/svg"
             fill="gray"
             viewBox="0 0 370 373"
             stroke="none"
             height="370"
             width="373">
          <defs>
            <linearGradient x1="0.25781251%"
                            y1="49.7500002%"
                            x2="101.257813%"
                            y2="49.7500002%"
                            id="linearGradient-1">
              <stop stopColor="#cdcdcd" offset="0%"></stop>
              <stop stopColor="#666666" offset="47.5247532%"></stop>
              <stop stopColor="#666666" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="r-copy" transform="translate(-15.000000, -20.000000)">
              <g id="Tile" transform="translate(15.000000, -54.000000)">
                <g strokeWidth="1" transform="translate(0.000000, 74.000000)">
                  <rect className="inner-rectangle"
                        x="0"
                        y="0"
                        width="347"
                        height="346"></rect>
                  <text x="50%"
                        y="80%"
                        className='rect-text'
                        alignmentBaseline="middle"
                        textAnchor="middle" >
                    <tspan className="inner-token" fill={color(token) || 'white'} >
                      { token || 'nil' }
                    </tspan>
                    
                  </text>
                </g>
                <path d="M369.703563,445.690524 L370,445.986636 L370,101 L346,74 L346,420 L1.1937118e-12,420 L26.8543537,446.001266 L369.993318,446.006682 L369.703563,445.690524 Z" fill="url(#linearGradient-1)"></path>
              </g>
            </g>
          </g>
        </svg>
      </div>
    )
  }
}

export default Tile
