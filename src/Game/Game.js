import React, { Component } from 'react'
import { connect } from 'react-redux'
import { start, tick, pause, resume, abort } from '../reducers'
import GameOver from '../components/GameOver/GameOver'
import GamePaused from '../components/GamePaused/GamePaused'
import GameRunning from '../components/GameRunning/GameRunning'

class Game extends Component {
  componentDidMount() {
    clearInterval(this.props.timer)
    this.props.start()
  }
  componentWillUnmount() {
    clearInterval(this.props.timer)
    this.props.abort()
  }
  render() {
    const {
      gameRunning,
      gameOver,
      timeLeft,
      start,
      pause,
      resume,
      gamePaused
    } = this.props
    return (
      <div>
        { gameRunning && <GameRunning pause={pause} timeLeft={timeLeft} /> }
        { gameOver && <GameOver restart={start}/> }
        { gamePaused && <GamePaused resume={resume} /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    timer: state.timer,
    timeLeft: state.timeLeft,
    gameRunning: state.gameRunning,
    gameOver: state.gameOver,
    gamePaused: state.gamePaused
  })
}

export default connect(mapStateToProps, {start, tick, pause, resume, abort})(Game)
