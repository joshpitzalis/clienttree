import React from 'react';
import PropTypes from 'prop-types';
// import DatePicker from 'react-date-picker';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import differenceInDays from 'date-fns/differenceInDays';
import { useDispatch } from 'react-redux';
import { Input } from './Input';
import { FORM_SUBMITTED } from './statsConstants';

const propTypes = {
  userId: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  userStats: PropTypes.shape({
    goal: PropTypes.string,
    average: PropTypes.string,
    income: PropTypes.string,
    deadline: PropTypes.string,
  }).isRequired,
};

const defaultProps = {};

const useDerivedProjectData = state => {
  const projectCount = Math.ceil((state.goal - state.income) / state.average);
  const timeLeft = state.deadline ? formatDistanceToNow(state.deadline) : null;
  const weeks = state.deadline
    ? Math.floor(
        Math.abs(
          differenceInDays(new Date(), new Date(state.deadline)) / projectCount
        ) / 7
      )
    : null;

  return [projectCount, timeLeft, weeks];
};

export function GeneralForm({ userId, send, userStats }) {
  const dispatch = useDispatch();
  const [state, setState] = React.useState(userStats);
  const [projectCount, timeLeft, weeks] = useDerivedProjectData(state);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch({
      type: FORM_SUBMITTED,
      payload: { ...state, userId },
    });
    send('CLOSED');
  };

  return (
    <div className="measure center" data-testid="contactModal">
      <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
        <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
        <div className="flex justify-center">
          {state.goal && state.average && (
            <Statement
              projectCount={projectCount}
              timeLeft={timeLeft}
              weeks={weeks}
              goal={state.goal}
              deadline={state.deadline}
            />
          )}
          <div className="w-50">
            <Input
              setState={setState}
              state={state}
              value={state.goal}
              name="goal"
              placeholder="How much do you want to make?"
              comment="Measured in thousands of USD"
            />

            <Input
              setState={setState}
              state={state}
              value={state.average}
              name="average"
              placeholder="Price of your average project?"
              comment="Measured in thousands of USD"
            />

            {state.goal && state.average ? (
              <>
                <Input
                  setState={setState}
                  state={state}
                  value={state.income}
                  name="income"
                  placeholder="How much have you made so far?"
                  comment="Measured in thousands of USD"
                />
                <>
                  <p className="db fw6 lh-copy f6 ttc ">
                    When do you pay taxes?
                  </p>
                  {/* <DatePicker
                    onChange={deadline => setState({ ...state, deadline })}
                    className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                    value={state.deadline ? new Date(state.deadline) : null}
                  /> */}
                </>{' '}
              </>
            ) : null}
          </div>
        </div>
        <div className="mt3 flex justify-around items-center">
          <button
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
            type="submit"
            onClick={e => handleSubmit(e)}
          >
            Save
          </button>

          <button
            onClick={() =>
              send({
                type: 'CLOSED',
                payload: {
                  incomeGoalsCompleted: state.goal && state.average,
                },
              })
            }
            type="button"
            className="small-caps ml3 bn pointer"
          >
            Close
          </button>
        </div>
      </fieldset>
    </div>
  );
}

GeneralForm.propTypes = propTypes;
GeneralForm.defaultProps = defaultProps;

const statementPropTypes = {
  projectCount: PropTypes.number.isRequired,
  timeLeft: PropTypes.number.isRequired,
  weeks: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  deadline: PropTypes.number.isRequired,
};
const statementDefaultProps = {};

function Statement({ projectCount, timeLeft, weeks, goal, deadline }) {
  return (
    <div className="w-50 pv2 pr4">
      <p className="measure lh-copy f3 fw6">
        {`Making ${goal}K this year means completing ${projectCount} projects`}
        {deadline && ` in the next ${timeLeft}`}.
      </p>

      {projectCount && timeLeft && (
        <p className="measure lh-copy ">
          {weeks > 1
            ? `That gives you a maximum of ${weeks} weeks per project if there is no
              overlap.`
            : `That gives you less than a week per project if there is no
              overlap.`}
        </p>
      )}
    </div>
  );
}

Statement.propTypes = statementPropTypes;
Statement.defaultProps = statementDefaultProps;
