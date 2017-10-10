import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
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

export default ProgressBar
