import React, { Component } from 'react'
import Tile from '../Tile/Tile'
import { connect } from 'react-redux'
import css from './turtle.css'
class Turtle extends Component {
  tile(i) {
    const { board } = this.props
    const { token, index, active } = board[i]
    return(
      <Tile caption={ token }
            active={ active }
            id={`tile_${index}`}
            key={ index } />
    )
  }

  firstLayer() {
    return(
      <div className='first-layer'>
        <div className="row row-11">
          { /* 1. 6 tiles */ }
          { [87,88,89,90,91,92].map((i) => this.tile(i)) }
        </div>
        <div className="row row-12">
          { /* 2. 6 tiles */ }
          { [93,94,95,96,97,98].map((i) => this.tile(i)) }
        </div>
        <div className="row row-13">
          { /* 3. 6 tiles */ }
          { [99,100,101,102,103,104].map((i) => this.tile(i)) }
        </div>
        <div className="row row-14">
          { /* 4. 6 tiles */ }
          { [105,106,107,108,109,110].map((i) => this.tile(i)) }
        </div>
        <div className="row row-15">
          { /* 5. 6 tiles */ }
          { [111,112,113,114,115,116].map((i) => this.tile(i)) }
        </div>
        <div className="row row-16">
          { /* 6. tiles */ }
          { [117,118,119,120,121,122].map((i) => this.tile(i)) }
        </div>
      </div>
    )
  }

  secondLayer() {
    return(
      <div className='second-layer'>
        <div className="row row-17">
          { /* 1. 4 tiles */ }
          { [123,124,125,126].map((i) => this.tile(i)) }
        </div>
        <div className="row row-18">
          { /* 2. 4 tiles */ }
          { [127,128,129,130].map((i) => this.tile(i)) }
        </div>
        <div className="row row-19">
          { /* 3. 4 tiles */ }
          { [131,132,133,134].map((i) => this.tile(i)) }
        </div>
        <div className="row row-20">
          { /* 4. 4 tiles */ }
          { [135,136,137,138].map((i) => this.tile(i)) }
        </div>
      </div>
    )
  }

  thirdLayer() {
    return(
      <div className='third-layer'>
        <div className="row row-21">
          { /* 1. 2 tiles */ }
          { [139,140].map((i) => this.tile(i)) }
        </div>
        <div className="row row-22">
          { /* 2. 2 tiles */ }
          { [141,142].map((i) => this.tile(i)) }
        </div>
      </div>
    )
  }
  
  topPiece() {
    return(
      <div className='top-piece'>
        <div className="row row-22">
          { /* last piece on top, numbers don't make sense */ }
          { [143].map((i) => this.tile(i)) }
        </div>
      </div>
    )
  }

  bottom() {
    return(
      <div className='bottom'>
        <div className="row row-1">
          { /* 12 tiles */ }
          { [0,1,2,3,4,5,6,7,8,9,10,11].map((i) => this.tile(i)) }
        </div>
        <div className="row row-2">
          { /* 8 tiles */ }
          { [12,13,14,15,16,17,18,19].map((i) => this.tile(i)) }
        </div>
        <div className="row row-3">
          { /* 10 tiles */ }
          { [20,21,22,23,24,25,26,27,28,29].map((i) => this.tile(i)) }
        </div>
        <div className="row row-4">
          { /* 12 tiles */ }
          { [30,31,32,33,34,35,36,37,38,39,40,41].map((i) => this.tile(i)) }
        </div>
        <div className="row row-5-left">
          { /* 1 tile very left and centered */ }
          { [42].map((i) => this.tile(i)) }
        </div>
        <div className="row row-6">
          { /* 12 tiles */ }
          { [43,44,45,46,47,48,49,50,51,52,53,54].map((i) => this.tile(i)) }
        </div>
        <div className="row row-7-right">
          { /* 2 tiles very right and centered */ }
          { [55,56].map((i) => this.tile(i)) }
        </div>
        <div className="row row-8">
          { /* 10 tiles */ }
          { [57,58,59,60,61,62,63,64,65,66].map((i) => this.tile(i)) }
        </div>
        <div className="row row-9">
          { /* 8 tiles */ }
          { [67,68,69,70,71,72,73,74].map((i) => this.tile(i)) }
        </div>
        <div className="row row-10">
          { /* 12 tiles */ }
          { [75,76,77,78,79,80,81,82,83,84,85,86].map((i) => this.tile(i)) }
        </div>
      </div>
    )
  }

  render() {
    const { board } = this.props
    return(
      <div className="turtle">
        { this.bottom() }
        { this.firstLayer() }
        { this.secondLayer() }
        { this.thirdLayer() }
        { this.topPiece() }
      </div>
    )
  }
}

const mapStateToProps = ({ board }) => {
  return({
    board: board
  });
}
export default connect(mapStateToProps, {})(Turtle)
