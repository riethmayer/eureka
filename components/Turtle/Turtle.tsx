import { useAppDispatch, useAppSelector } from '@store/hooks';
import Tile from '../Tile/Tile'
import { clicked, selectBoard } from '@store/gameBoard'

const Turtle = () => {
  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();


  return(
    <div className="turtle">
      { 
        Object.keys(board).map((idx) => {
          const { active, column, layer, row, token, index} = board[idx];
          return <Tile 
            token={ token }
            row={ row }
            column={ column }
            layer={ layer }
            active={ active }
            className={`${token}`}
            id={`tile_${index}`}
            onClick={ () => dispatch(clicked(index)) }
            key={ index } />
        })
      }
    </div>
  )
}

export default Turtle