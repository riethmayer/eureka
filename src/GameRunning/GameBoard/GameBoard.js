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

const InnerProgressBar = styled.div`
width: ${props => props.percentage}%;
height: 20px;
margin: 0 0 10px 0;
background-color: ${props => props.percentage > 75 ? 'red' : 'green'};
`
const OuterProgressBar = styled.div`
position: relative;
width: 620px;
height: 20px;
margin: 0 auto;
background-color: #333;
`
const TimerProgressBar = styled.div`
color: white;
float: left;
margin-left: 555px;
`

const ProgressBar = ({timeLeft}) => {
  const percentage = (1-(timeLeft / 180))*100
  return (
    <div>
      <OuterProgressBar>
        <InnerProgressBar percentage={percentage}>
          <TimerProgressBar>
            { moment.utc(timeLeft*1000).format('mm:ss') }
          </TimerProgressBar>
        </InnerProgressBar>
      </OuterProgressBar>
    </div>
  )
}



class GameBoard extends Component {
  render() {
    const { timeLeft, pause, start } = this.props
    return (
      <Board>
        <Menu align="center" >
          <Box width={1} p={10}>
            <Title>Eureka</Title>
          </Box>
        </Menu>
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

const mapStateToProps = ({board}) => {
  return({
    board: board
  });
}

export default connect(mapStateToProps, { clicked })(GameBoard)
