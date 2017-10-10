import React, { Component } from 'react'
import { connect } from 'react-redux'
import Turtle from '../../components/Turtle/Turtle'
import { clicked } from '../../reducers/gameBoard.js'
import moment from 'moment'
import styled, { injectGlobal } from 'styled-components'
import { Flex, Box } from 'grid-styled'

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

const Menu = styled.div`
`

const Board = styled.div`
background-color: #333;
width: 640px;
margin: 10px;
`

const Main = styled.div`
background-color: white;
height: 340px;
padding: 10px 10px 0 10px;
width: 600px;
margin: 10px;
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
color: ${props => props.primary && colors.dark || colors.light};
cursor: pointer;
background-color: ${(props) => props.primary && colors.primary || props.secondary && colors.secondary }
`

const Title = styled.h1`
color: white;
text-align: center;
`

const InnerProgressBar = styled.div`
width: ${props => props.percentage}px;
height: 10px;
margin: 0 0 10px 0;
background-color: ${props => props.percentage > 75 ? 'red' : 'green'};
`
const OuterProgressBar = styled.div`
position: relative;
width: 550px;
height: 10px;
margin: 0 0 10px 0;
background-color: black;
`
const TimerProgressBar = styled.div`
position: absolute;
right: 5px;
top: 0;
margin-bottom: 3px;
`

const ProgressBar = ({timeLeft}) => {
  const percentage = Math.round(100-(timeLeft / 180 * 100))
  return (
    <div>
      <OuterProgressBar>
        <TimerProgressBar>
          { moment.utc(timeLeft*1000).format('mm:ss') }
        </TimerProgressBar>
        <InnerProgressBar percentage={percentage}>
        </InnerProgressBar>
      </OuterProgressBar>
    </div>
  )
}



class GameBoard extends Component {
  render() {
    const { timeLeft } = this.props
    return (
      <Board>
        <Menu align="center" >
          <Box width={1} p={10}>
            <Title>Eureka</Title>
          </Box>
        </Menu>
        <Main>
          <ProgressBar timeLeft={timeLeft} />
          <Turtle />
        </Main>
        <Controls>
          <Button primary>
            Pause
          </Button>
          <Button secondary>
            Restart
          </Button>
        </Controls>
      </Board>
    )
  }
}

const mapStateToProps = ({board}) => {
  return({
    board: board
  });
}

export default connect(mapStateToProps, { clicked })(GameBoard)
