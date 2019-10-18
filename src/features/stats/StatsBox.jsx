import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import differenceInDays from 'date-fns/differenceInDays';
import Portal from '../../utils/Portal';
import { Input } from './Input';

const propTypes = {};

const defaultProps = {};

export default function StatsBox() {
  const [visible, setVisibility] = React.useState(false);

  return (
    <>
      {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
          }}
        >
          {/* <InvoiceForm  /> */}
          <GeneralForm />
        </Portal>
      )}

      <article className="pt5 w5 center bg-white br3 pv3 pv4-ns mv3 pl2">
        <div
          className="tc mv4 pt5 pointer "
          role="button"
          tabIndex={-1}
          onKeyPress={() => setVisibility(true)}
          onClick={() => setVisibility(true)}
        >
          <h1 className="f4 tl">
            $45,781 <small className="fw5">/ 100K</small>
          </h1>
        </div>

        <dl className="db mr5   ">
          <dd className="f6 f5-ns b ml0">
            {/* 3:1  */}
            Projects
          </dd>
          <dd className="f3 f2-ns b ml0">12</dd>
        </dl>

        <dl className="db mr5 mt3">
          <dd className="f6 f5-ns b ml0">
            {/* 5:1  */}
            Leads
          </dd>
          <dd className="f3 f2-ns b ml0 ">70</dd>
        </dl>

        <dl className="db mr5 mt3">
          <dd className="f6 f5-ns b ml0">Activities</dd>
          <dd className="f3 f2-ns b ml0">261 </dd>
        </dl>
      </article>
    </>
  );
}

StatsBox.propTypes = propTypes;
StatsBox.defaultProps = defaultProps;

function InvoiceForm() {
  const [state, setState] = React.useState({
    date: '',
    project: '',
    amount: '',
  });
  return (
    <form
      className="measure center"
      data-testid="contactModal"
      onSubmit={() => {}}
    >
      <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
        <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
        <div className="flex justify-center">
          <div className="w-50">
            <Input
              setState={setState}
              state={state}
              value={state.invoice}
              name="amount"
              placeholder="How much did you just bill for?"
            />

            <Input
              setState={setState}
              state={state}
              value={state.project}
              name="project"
              placeholder="Whats the name of the project?"
            />
            <Input
              setState={setState}
              state={state}
              value={state.date}
              name="date"
              placeholder="When was this paid?"
            />
          </div>
        </div>
      </fieldset>
      <div className="mt3 flex justify-around items-center">
        <input
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Add Payment"
        />
      </div>
    </form>
  );
}

function GeneralForm() {
  const [state, setState] = React.useState({
    goal: '100',
    average: '',
    income: '',
    deadline: '',
  });

  const projectCount = Math.ceil((state.goal - state.income) / state.average);
  const timeLeft = state.deadline && formatDistanceToNow(state.deadline);
  const weeks = Math.floor(
    Math.abs(
      differenceInDays(new Date(), new Date(state.deadline)) / projectCount
    ) / 7
  );

  return (
    <form
      className="measure center"
      data-testid="contactModal"
      onSubmit={() => {}}
    >
      <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
        <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
        <div className="flex justify-center">
          {state.goal && state.average && (
            <div className="w-50 pv2 pr4">
              <p className="measure lh-copy f3 fw6">
                {`Making ${state.goal}K this year means completing ${projectCount} projects`}
                {state.deadline && ` in the next ${timeLeft}`}.
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

            <Input
              setState={setState}
              state={state}
              value={state.income}
              name="income"
              placeholder="How much have you made so far?"
              comment="Measured in thousands of USD"
            />
            <>
              <p className="db fw6 lh-copy f6 ttc ">When do you pay taxes?</p>
              <DatePicker
                onChange={deadline => setState({ ...state, deadline })}
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa2 br2 mb2"
                value={state.deadline}
              />
            </>
          </div>
        </div>
      </fieldset>
      {/* <div className="mt3 flex justify-around items-center">
        <input
          className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
          type="submit"
          value="Save"
        />
      </div> */}
    </form>
  );
}
