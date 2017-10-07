import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tile from '../../components/Tile/Tile'
import { clicked } from '../../reducers/gameBoard.js'

class GameBoard extends Component {
  tile(tileData) {
    const { token, index, active } = tileData
    const { clicked } = this.props
    return(
      <Tile caption={ token }
            active={ active }
            id={`tile_${index}`}
            onClick={ () => clicked(index) }
            key={ index } />
    )
  }

  render() {
    const { board } = this.props
    return (
      <div>
        <h1>Game Board </h1>
        { Object.keys(board).map(t => this.tile(board[t])) }
      </div>
    )
  }
}

const mapStateToProps = ({board}) => {
  return({
    board: board
  });
}

export default connect(mapStateToProps, { clicked })(GameBoard)
