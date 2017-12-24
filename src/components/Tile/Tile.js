import React, { Component } from 'react'
import _ from 'lodash'
import color from './colors'
import './tile.css'
import styled from 'styled-components'

const StyledStone = styled.div`
border-top: 2px #dedede solid;
border-left: 2px #dedede solid;
border-right: 2px #555 solid;
border-bottom: 2px #555 solid;
height: 4em;
width: 3em;
background-color: #ccc;
display: flex;
justify-content: center;
align-items: center;
`

const StyledText = styled.p`
font-family: 'Helvetica';
font-weight: 900;
font-size: 2.7em;
color: ${ props => props.tokenColor };
`

const Stone = ({token}) => {
  const tokenColor = color(token)
  return (
    <StyledStone>
      <StyledText tokenColor={ tokenColor }>
        { token }
      </StyledText>
    </StyledStone>
  )
}



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
        <Stone token={token} />
      </div>
    )
  }
}

export default Tile
