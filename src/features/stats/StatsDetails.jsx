import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from '@duik/it';
import { CSSTransition } from 'react-transition-group';
import './statsAnimation.css';

const statPropTypes = {
  userStats: PropTypes.shape({
    stats: PropTypes.shape({
      goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      income: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      average: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      projectRatio: PropTypes.number,
      leadRatio: PropTypes.number,
      leadsContacted: PropTypes.number,
      projectsCompleted: PropTypes.number,
      activitiesCompleted: PropTypes.number,
    }),
  }).isRequired,
  showModal: PropTypes.func.isRequired,
};
const statDefaultProps = {};

export const Stats = ({ userStats, showModal }) => {
  const {
    goal = 0,
    income = 0,
    average = 0,
    projectRatio = 3,
    leadRatio = 10,
    leadsContacted = 0,
    projectsCompleted = 0,
    activitiesCompleted = 0,
  } = userStats && userStats.stats;

  const projectCount = Math.ceil((goal - income) / average);

  const [visibility, setVisibility] = React.useState(false);
  const totalActivitiesNeeded = projectCount * projectRatio * leadRatio;
  const leadsNeeded = projectCount * projectRatio;

  const activitiesLeft = totalActivitiesNeeded - activitiesCompleted;
  const leadsLeft = leadsNeeded - leadsContacted;
  const projectsLeft = projectCount - projectsCompleted;

  return (
    <article
      className="w5 pl4 fixed pt5 mw-100"
      style={{ bottom: 0 }}
      data-testid="complete-screen"
      onMouseLeave={() => setVisibility(false)}
    >
      <CSSTransition
        in={income < goal && visibility}
        timeout={500}
        classNames="rollUp"
        unmountOnExit
      >
        <div
          data-testid="statsDetails"
          role="button"
          className="relative pointer"
          tabIndex={-2}
          onKeyPress={() => showModal()}
          onClick={() => showModal()}
        >
          <dl className="db mr5">
            <dd className="f3 f2-ns b ml0 mb0">{projectsLeft}</dd>
            <dd className="f6 f5-ns ml0">Projects to go</dd>
          </dl>
          {/* <small className="fw5 small-caps o-50">Which means...</small> */}
          <dl className="db mr5 mt3">
            <dd className="f3 f2-ns b ml0 mb0">{leadsLeft}</dd>
            <dd className="f6 f5-ns  ml0">Potential Projects</dd>
          </dl>
          {/* <small className="fw5 small-caps o-50">Which means...</small> */}
          <dl className="db mr5 mt3">
            <dd className="f3 f2-ns b ml0 mb0">
              {activitiesLeft < leadsLeft ? leadsLeft : activitiesLeft}
            </dd>
            <dd className="f6 f5-ns  ml0">Activities To Complete</dd>
          </dl>
        </div>
      </CSSTransition>
      <div
        className="tc mv4  pointer "
        role="button"
        tabIndex={-1}
        onKeyPress={() => showModal()}
        onClick={() => showModal()}
        data-testid="statsTitle"
        onMouseEnter={() => setVisibility(true)}
      >
        <h1 className="f4 tl">
          {`$ ${income}`}
          {visibility && <small className="fw5"> / ${`${goal}`}</small>}
        </h1>

        <Progress fill={income / goal} />
      </div>
    </article>
  );
};
Stats.propTypes = statPropTypes;
Stats.defaultProps = statDefaultProps;
