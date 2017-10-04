import React, { Component } from 'react'
import { connect } from 'react-redux'

import TimeLeft from '../components/TimeLeft/TimeLeft'
import Tile from '../components/Tile/Tile'
import { pause } from '../reducers'

class GameRunning extends Component {
  clicked(name,index) {
    return (() => {
      console.log(name, index)
    })
  }
  tile(name, index) {
    return(
      <Tile caption={name} id={`tile_${index}`} onClick={this.clicked(name, index)} key={`tile_${index}`}/>
    )
  }
  render() {
    const { timeLeft } = this.props
    return(
      <div>
        <TimeLeft timeLeft={timeLeft} pause={pause} />
        { ['a','b'].map((elem, index) => this.tile(elem, index)) }
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return({
    timeLeft: state.timeLeft,
  })
}

export default connect(mapStateToProps, {pause})(GameRunning)
