import React, { Component } from 'react'
import { connect } from 'react-redux'

import TimeLeft from '../components/TimeLeft/TimeLeft'
import GameBoard from './GameBoard/GameBoard'

import { pause } from '../reducers/timer'

class GameRunning extends Component {
  render() {
    const { timeLeft, gameRunning, pause } = this.props
    return(
      <div>
        <TimeLeft timeLeft={timeLeft} pause={pause} />
        { gameRunning && <GameBoard /> }
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

export default connect(mapStateToProps, { pause })(GameRunning)
