import { useSelector } from 'react-redux'
import { clicked } from '@actions/index'
import Tile from '../Tile/Tile'
import { wrapper } from '@store/store'
import { selectBoard } from '@store/gameBoard'


const Turtle = () => {
  const board = useSelector(selectBoard);
  const tile = (i: number) => {
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

  return(
    <div className="turtle">
      { Object.keys(board).map((index) => { return tile(index) } )}
    </div>
  )
}

const mapStateToProps = ({board}) => {
  return({
    board
  });
}

export default wrapper.withRedux(Turtle)
