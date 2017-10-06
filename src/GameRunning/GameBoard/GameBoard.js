import React, { Component } from 'react'
import { connect } from 'react-redux'
import Tile from '../../components/Tile/Tile'
import { clicked } from '../../reducers/gameBoard.js'

class GameBoard extends Component {
  tile(name, index) {
    const { clicked } = this.props
    return(
      <Tile caption={name}
            id={`tile_${index}`}
            onClick={ () => clicked(name, index) }
            key={`tile_${index}`}/>
    )
  }

  render() {
    const { board } = this.props
    return (
      <div>
        { Object.keys(board).map(t => this.tile(board[t], t)) }
        <h1>Game Board </h1>
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
