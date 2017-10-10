import React, { Component } from 'react'
import { connect } from 'react-redux'
import GameBoard from './GameBoard/GameBoard'
import { pause, start } from '../reducers/timer'

class GameRunning extends Component {
  render() {
    const { timeLeft, gameRunning, pause, start } = this.props
    return(
      <div>
        { gameRunning && <GameBoard timeLeft={timeLeft}
                                    pause={pause}
                                    start={start} /> }
      </div>
    )
  }
}


const mapStateToProps = ({time}) => {
  return({
    timeLeft: time.timeLeft,
    gameRunning: time.gameRunning,
    gameBoard: time.gameBoard
  })
}

export default connect(mapStateToProps, { pause, start })(GameRunning)
