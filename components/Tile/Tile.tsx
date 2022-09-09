import colour from './Colours'
import styled from 'styled-components'
import { TokenTile } from '@store/gameBoard'

interface Props {
  tokenColor: string
}

const StyledStone = styled.div`
border-top: 2px #dedede solid;
border-left: 2px #dedede solid;
border-right: 2px #555 solid;
border-bottom: 2px #555 solid;
height: 4em;
width: 3em;
background-color: #ccc;
display: flex;
justify-content: center;
align-items: center;
`

const StyledText = styled.p<Props>`
font-family: 'Helvetica';
font-weight: 900;
font-size: 2.7em;
color: ${ props => props.tokenColor };
`

const Stone = ({token}) => {
  const tokenColor = colour(token)
  return (
    <StyledStone>
      <StyledText tokenColor={ tokenColor }>
        { token }
      </StyledText>
    </StyledStone>
  )
}

export type TileProps = {
  onClick: () => void;
  className: string;
  id: string;
} & Omit<TokenTile, 'index'>

const StyledTile: React.FC<TileProps> = (
  {onClick, token, layer, column, row, active}
) => {
  const classes = [
      'tile',
      'rect',
      `layer-${layer}`,
      `column-${column}`,
      `row-${row}`,
      `${active ? 'active' : ''}`
    ].filter(Boolean).join(" ");

  return (
    <div onClick={onClick}
      className={classes}>
      <Stone token={token} />
    </div>
  )
}

export default StyledTile
