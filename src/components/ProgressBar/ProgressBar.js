import React from 'react'
import styled from 'styled-components'
import { initialTimeLeft as maxTime } from '../../reducers/timer'
import moment from 'moment'

const InnerProgressBar = styled.div`
width: ${props => props.percentage}%;
height: 20px;
margin: 0 0 10px 0;
background-color: ${props => props.percentage < 50 ? 'red' : 'green'};
`
const OuterProgressBar = styled.div`
height: 20px;
width: 620px;
margin: 0 auto;
background-color: #333;
`
const TimerProgressBar = styled.div`
color: white;
float: left;
margin-left: 555px;
`

const ProgressBar = ({timeLeft}) => {
  const percentage = ((timeLeft / maxTime))*100
  return (
    <div>
      <OuterProgressBar>
        <InnerProgressBar percentage={percentage} >
          <TimerProgressBar>
            { moment.utc(timeLeft*1000).format('mm:ss') }
          </TimerProgressBar>
        </InnerProgressBar>
      </OuterProgressBar>
    </div>
  )
}

export default ProgressBar
