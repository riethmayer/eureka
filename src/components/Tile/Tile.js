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
height: 40px;
width: 30px;
background-color: #ccc;
`

const StyledText = styled.p`
text-align: center;
padding: 0;
margin: 7px 0;
font-size: 3ex;
vertical-align: middle;
font-family: 'Helvetica';
font-weight: 900;
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
