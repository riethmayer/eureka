import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clicked } from '../../reducers/gameBoard.js'
import Tile from '../Tile/Tile'
import './turtle.css'


class Turtle extends Component {
  tile(i) {
    const { board, clicked } = this.props
    const {
      token,
      index,
      active,
      row,
      column,
      layer
    } = board[i]
    return(
      <Tile token={ token }
            row={ row }
            column={ column }
            layer={ layer }
            active={ active }
            className={`${token}`}
            id={`tile_${index}`}
            onClick={ () => clicked(index) }
            key={ index } />
    )
  }

  render() {
    const { board } = this.props
    return(
      <div className="turtle">
        { Object.keys(board).map((index) => { return this.tile(index) } )}
      </div>
    )
  }
}

const mapStateToProps = ({board}) => {
  return({
    board
  });
}

export default connect(mapStateToProps,{ clicked })(Turtle)
