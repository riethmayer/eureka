import React, { Component } from 'react'
import Tile from '../Tile/Tile'
import './turtle.css'

class Turtle extends Component {
  tile(i) {
    const { board, handleClick } = this.props
    const { token, index, active } = board[i]
    return(
      <Tile caption={ token }
            active={ active }
            id={`tile_${index}`}
            onClick={ () => handleClick(index) }
            key={ index } />
    )
  }

  tiles({layer, row}) {
    const { board } = this.props
    return(
      Object.keys(board).filter(
        (elem) =>{
          const tile = board[elem]
          return tile['layer'] === layer && tile['row'] === row
        }
      ).map((index) => { return this.tile(index) })
    )
  }

  firstLayer() {
    return(
      <div className='first-layer'>
        <div className="row row-11">
          { /* 1. 6 tiles */ }
          { this.tiles({ layer: 1, row: 11 }) }
        </div>
        <div className="row row-12">
          { /* 2. 6 tiles */ }
          { this.tiles({ layer: 1, row: 12 }) }
        </div>
        <div className="row row-13">
          { /* 3. 6 tiles */ }
          { this.tiles({ layer: 1, row: 13 }) }
        </div>
        <div className="row row-14">
          { /* 4. 6 tiles */ }
          { this.tiles({ layer: 1, row: 14 }) }
        </div>
        <div className="row row-15">
          { /* 5. 6 tiles */ }
          { this.tiles({ layer: 1, row: 15 }) }
        </div>
        <div className="row row-16">
          { /* 6. tiles */ }
          { this.tiles({ layer: 1, row: 16 }) }
        </div>
      </div>
    )
  }

  secondLayer() {
    return(
      <div className='second-layer'>
        <div className="row row-17">
          { /* 1. 4 tiles */ }
          { this.tiles({ layer: 2, row: 17 }) }
        </div>
        <div className="row row-18">
          { /* 2. 4 tiles */ }
          { this.tiles({ layer: 2, row: 18 }) }
        </div>
        <div className="row row-19">
          { /* 3. 4 tiles */ }
          { this.tiles({ layer: 2, row: 19 }) }
        </div>
        <div className="row row-20">
          { /* 4. 4 tiles */ }
          { this.tiles({ layer: 2, row: 20 }) }
        </div>
      </div>
    )
  }

  thirdLayer() {
    return(
      <div className='third-layer'>
        <div className="row row-21">
          { /* 1. 2 tiles */ }
          { this.tiles({ layer: 3, row: 21 }) }
        </div>
        <div className="row row-22">
          { /* 2. 2 tiles */ }
          { this.tiles({ layer: 3, row: 22 }) }
        </div>
      </div>
    )
  }

  topPiece() {
    return(
      <div className='top-piece'>
        <div className="row row-23">
          { /* last piece on top, numbers don't make sense */ }
          { this.tiles({ layer: 4, row: 23 }) }
        </div>
      </div>
    )
  }

  bottom() {
    return(
      <div className='bottom'>
        <div className="row row-1">
          { /* 12 tiles */ }
          { this.tiles({layer: 0, row: 1}) }
        </div>
        <div className="row row-2">
          { /* 8 tiles */ }
          { this.tiles({layer: 0, row: 2}) }
        </div>
        <div className="row row-3">
          { /* 10 tiles */ }
          { this.tiles({layer: 0, row: 3}) }
        </div>
        <div className="row row-4">
          { /* 12 tiles */ }
          { this.tiles({layer: 0, row: 4}) }
        </div>
        <div className="row row-5-left">
          { /* 1 tile very left and centered */ }
          { this.tiles({layer: 0, row: 5}) }
        </div>
        <div className="row row-6">
          { /* 12 tiles */ }
          { this.tiles({layer: 0, row: 6}) }
        </div>
        <div className="row row-7-right">
          { /* 2 tiles very right and centered */ }
          { this.tiles({layer: 0, row: 7}) }
        </div>
        <div className="row row-8">
          { /* 10 tiles */ }
          { this.tiles({layer: 0, row: 8}) }
        </div>
        <div className="row row-9">
          { /* 8 tiles */ }
          { this.tiles({layer: 0, row: 9}) }
        </div>
        <div className="row row-10">
          { /* 12 tiles */ }
          { this.tiles({layer: 0, row: 10}) }
        </div>
      </div>
    )
  }

  render() {
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

export default Turtle
