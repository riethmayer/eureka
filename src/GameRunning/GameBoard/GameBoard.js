import React, { Component } from 'react'
import { connect } from 'react-redux'
import Turtle from '../../components/Turtle/Turtle'
import { clicked } from '../../reducers/gameBoard.js'
import styled, { injectGlobal } from 'styled-components'
import { Flex, Box } from 'grid-styled'
import ProgressBar from '../../components/ProgressBar/ProgressBar'

injectGlobal`
body {
  font-family: 'Rubik', sans-serif;
}
            .tile-text {
              font-family: 'Rubik', sans-serif;
              font-weight: 900;
              font-size: 3ex;
            }
`

const colors = {
  primary: 'papayawhip',
  secondary: 'tomato',
  dark: '#333333',
  light: '#efefef'
}


const Board = styled.div`
background-color: #333;
width: 100%;
`

const Main = styled.div`
background-color: white;
height: 350px;
padding: 0;
width: 615px;
margin: 0 auto;
padding: 20px 0 0 5px;
`

const Controls = styled(Flex)`
padding: 10px 0;
width: 420px;
margin: 0 auto;
`

const Button = styled.button`
text-align: center;
align: center;
margin: 1px 1px;
font-size: 3ex;
height: 60px;
width: 198px;
border: 0px solid transparent;
color: ${props => (props.primary && colors.dark) || colors.light};
cursor: pointer;
background-color: ${(props) => (props.primary && colors.primary) || (props.secondary && colors.secondary) }
`

const Title = styled.h1`
color: white;
text-align: center;
`
const ScoreValue = styled.h2`
color: white;
text-align: center;
`

const Score = ({ score }) => {
  return (
    <ScoreValue>
      { score } Punkte
    </ScoreValue>
  )
}


class GameBoard extends Component {
  render() {
    const { timeLeft, pause, start, score } = this.props
    return (
      <Board>
        <Box width={1} p={10}>
          <Title>Eureka</Title>
          <Score score={ score } />
        </Box>
        <ProgressBar timeLeft={timeLeft} />
        <Main>
          <Turtle />
        </Main>
        <Controls>
          <Button primary onClick={ pause }>
            Pause
          </Button>
          <Button secondary onClick={ start }>
            Restart
          </Button>
        </Controls>
      </Board>
    )
  }
}

const mapStateToProps = ({board, score}) => {
  return({
    board: board,
    score: score
  });
}

export default connect(mapStateToProps, { clicked })(GameBoard)
