import styled from 'styled-components'
import moment from 'moment'
import { TIME_TO_SOLVE as maxTime } from '@store/constraints';

interface Props {
  percentage: number
}

const InnerProgressBar = styled.div<Props>`
width: ${props => props.percentage}%;
height: 20px;
margin: 0 0 10px 0;
background-color: ${props => props.percentage < 50 ? 'red' : 'green'};
`
const OuterProgressBar = styled.div`
height: 20px;
width: 49.7em;
margin: 0 auto;
background-color: #333;
`
const ProgressBarBorder = styled.div`
width: 50.3em;
height: 24px;

margin: 10px auto;
padding-top: 4px;
background-color: #555;
`

const TimerProgressBar = styled.div`
color: white;
float: left;
margin-left: 625px;
`

const ProgressBar = ({timeLeft}) => {
  const percentage = ((timeLeft / maxTime))*100
  return (
    <div>
      <ProgressBarBorder>
        <OuterProgressBar>
          <InnerProgressBar percentage={percentage} >
            <TimerProgressBar>
              { moment.utc(timeLeft*1000).format('mm:ss') }
            </TimerProgressBar>
          </InnerProgressBar>
        </OuterProgressBar>
      </ProgressBarBorder>
    </div>
  )
}

export default ProgressBar
