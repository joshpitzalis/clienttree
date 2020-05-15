import React from 'react'
import PropTypes from 'prop-types'
// import DatePicker from 'react-date-picker';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import differenceInDays from 'date-fns/differenceInDays'
import { FormGroupContainer, FormGroup, Progress } from '@duik/it'
import { useDispatch } from 'react-redux'
import { Tooltip } from 'antd'
import { Input } from './Input'
import { FORM_SUBMITTED } from './statsConstants'

const propTypes = {
  userId: PropTypes.string.isRequired,
  userStats: PropTypes.shape({
    stats: PropTypes.shape({
      goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      average: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      income: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      deadline: PropTypes.string
    })
  })
}

const defaultProps = {
  userStats: {
    stats: {
      goal: '',
      average: '',
      income: 0,
      deadline: ''
    }
  }
}

const useDerivedProjectData = stats => {
  const { goal = 0, deadline = 0, average = 0, income = 0 } = stats
  const projectCount = Math.ceil((goal - income) / average)

  const timeLeft = deadline ? formatDistanceToNow(deadline) : null
  const weeks = deadline
    ? Math.floor(
      Math.abs(
        differenceInDays(new Date(), new Date(deadline)) / projectCount
      ) / 7
    )
    : null

  return [projectCount, timeLeft, weeks]
}

export function GeneralForm ({ userId, userStats }) {
  const [projectCount, timeLeft, weeks] = useDerivedProjectData(
    userStats && userStats.stats
  )
  const dispatch = useDispatch()
  const { goal, deadline, average, income = 0 } = userStats && userStats.stats

  return (
    <form data-testid='contactModal'>
      <FormGroupContainer>
        <Statement
          projectCount={projectCount}
          timeLeft={timeLeft}
          weeks={weeks}
          goal={goal}
          deadline={deadline}
        />
      </FormGroupContainer>

      <FormGroupContainer horizontal>
        <FormGroup>
          <Input
            value={goal}
            name='goal'
            placeholder='How much do you want to make ?'
            comment=''
            label='Your Income Goal This Year'
            type='number'
            rightEl={<small>USD</small>}
            userId={userId}
            eventType={FORM_SUBMITTED}
            dispatch={dispatch}
          />
        </FormGroup>
        <FormGroup>
          <Input
            value={average}
            name='average'
            placeholder=''
            comment=''
            label='The Price of Your Ideal Project'
            type='number'
            rightEl={<small>USD</small>}
            userId={userId}
            eventType={FORM_SUBMITTED}
            dispatch={dispatch}
          />
        </FormGroup>
      </FormGroupContainer>

      {goal && average ? (
        <IncomeBox
          income={income}
          goal={goal}
          userId={userId}
          dispatch={dispatch}
        />
      ) : (
        <small className='measure center o-50'>
          Completing this form will show you how many people you have to help
          each week to hit your income goal for the year.
        </small>
      )}
    </form>
  )
}

GeneralForm.propTypes = propTypes
GeneralForm.defaultProps = defaultProps

const statementPropTypes = {
  projectCount: PropTypes.number.isRequired,
  goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
const statementDefaultProps = {}

function Statement ({ projectCount, goal }) {
  return (
    <div className='w-100 pb5'>
      <p className='f1 lh-title b' data-testid='incomeStatement'>
        {projectCount <= 0 && 'Congratulations!'}
        {` Making ${goal ? `$ ${goal}` : '_____'} this year means completing ${
          projectCount <= 0 ? 'no more' : projectCount || '_____'
        } projects`}
        .
      </p>

      {!!projectCount && projectCount > 0 && (
        <Tooltip
          placement='bottom'
          title='The lead and project conversion ratios start out with default
         values (10: 1 and 3:1) but the numbers will update as you start reaching
         out to people, collecting leads and completing projects.'
        >
          <p className='f3 lh-copy' data-testid='hustleEstimate'>
            {`
          Landing ${projectCount} ${
              projectCount > 1 ? 'projects' : 'project'
            }  means you will need to pitch ${projectCount * 3}
          ${
            projectCount * 3 > 1 ? 'leads' : 'lead'
          }, which means helping atleast ${projectCount * 3 * 10} ${
              projectCount * 3 * 10 > 1 ? 'people' : 'person'
            }.`}
          </p>
        </Tooltip>
      )}
    </div>
  )
}

Statement.propTypes = statementPropTypes
Statement.defaultProps = statementDefaultProps

const incomePropTypes = {
  income: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
}
const incomeDefaultProps = {}

export const IncomeBox = ({ income, goal, userId, dispatch }) => (
  <FormGroupContainer horizontal data-testid='incomeBar'>
    <div className='flex flex-column'>
      <Progress fill={income / goal} />
      <div className='flex justify-center items-center'>
        <div>
          <p className='mt3'>{`$${income} earned so far this year `}</p>
          <Input
            value={income}
            name='income'
            placeholder=''
            comment=''
            label='Total income so far?'
            type='number'
            rightEl={<small>USD</small>}
            userId={userId}
            eventType={FORM_SUBMITTED}
            dispatch={dispatch}
          />
        </div>
      </div>
      <small className='mt4'>
        Your hustle meter is set. Close this modal and start helping people.
      </small>
    </div>
  </FormGroupContainer>
)

IncomeBox.propTypes = incomePropTypes
IncomeBox.defaultProps = incomeDefaultProps
