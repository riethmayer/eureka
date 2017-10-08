import React, { Component } from 'react'
import { connect } from 'react-redux'
import Turtle from '../../components/Turtle/Turtle'
import { clicked } from '../../reducers/gameBoard.js'

class GameBoard extends Component {

  render() {
    const { board, clicked } = this.props
    return (
      <div>
        <h1>Game Board</h1>
        <Turtle handleClick={ clicked }
                board={ board }
        />
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
