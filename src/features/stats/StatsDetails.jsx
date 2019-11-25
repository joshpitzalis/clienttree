import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from '@duik/it';

const statPropTypes = {
  userStats: PropTypes.shape({
    stats: PropTypes.shape({
      goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      income: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      average: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      projectRatio: PropTypes.number,
      leadRatio: PropTypes.number,
    }),
  }).isRequired,
  showModal: PropTypes.func.isRequired,
};
const statDefaultProps = {};

export const Stats = ({ userStats, showModal }) => {
  const {
    goal,
    income = 0,
    average,
    projectRatio,
    leadRatio,
  } = userStats.stats;
  const projectCount = Math.ceil((goal - income) / average);

  return (
    <article
      className="w5 pl4 fixed pt5"
      style={{ bottom: 0 }}
      data-testid="complete-screen"
    >
      {income < goal && (
        <div data-testid="statsDetails">
          <small className="fw5 small-caps o-50">You need...</small>
          <dl className="db mr5">
            <dd className="f6 f5-ns  ml0">Projects</dd>
            <dd className="f3 f2-ns b ml0">{projectCount}</dd>
          </dl>

          <dl className="db mr5 mt3">
            <dd className="f6 f5-ns  ml0">Leads</dd>
            <dd className="f3 f2-ns b ml0 ">{projectCount * projectRatio}</dd>
          </dl>

          <dl className="db mr5 mt3">
            <dd className="f6 f5-ns  ml0">Activities</dd>
            <dd className="f3 f2-ns b ml0">
              {projectCount * projectRatio * leadRatio}
            </dd>
          </dl>
        </div>
      )}
      <div
        className="tc mv4  pointer "
        role="button"
        tabIndex={-1}
        onKeyPress={() => showModal()}
        onClick={() => showModal()}
        data-testid="statsTitle"
      >
        <Progress fill={income / goal} />
        <h1 className="f4 tl">
          {`$ ${income}`}
          <small className="fw5">/ {`${goal}`}</small>
        </h1>
      </div>
    </article>
  );
};
Stats.propTypes = statPropTypes;
Stats.defaultProps = statDefaultProps;
