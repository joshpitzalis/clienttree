import React from 'react';
import PropTypes from 'prop-types';

const statPropTypes = {
  userStats: PropTypes.shape({
    goal: PropTypes.number,
    income: PropTypes.number,
    average: PropTypes.number,
  }).isRequired,
  showModal: PropTypes.func.isRequired,
};
const statDefaultProps = {};

export const Stats = ({ userStats, showModal }) => {
  const { goal, income, average } = userStats;
  const projectCount = Math.ceil((goal - income) / average);

  return (
    <article
      className="pt5 w5 center bg-white br3 pv3 pv4-ns mv3 pl2"
      data-testid="complete-screen"
    >
      <div
        className="tc mv4 pt5 pointer "
        role="button"
        tabIndex={-1}
        onKeyPress={() => showModal()}
        onClick={() => showModal()}
        data-testid="statsTitle"
      >
        <h1 className="f4 tl">
          {`$${income}K`}
          <small className="fw5">/ {`${goal}K`}</small>
        </h1>
      </div>

      <>
        <small className="fw5 small-caps">You need...</small>
        <dl className="db mr5">
          <dd className="f6 f5-ns  ml0">Projects</dd>
          <dd className="f3 f2-ns b ml0">{projectCount}</dd>
        </dl>

        <dl className="db mr5 mt3">
          <dd className="f6 f5-ns  ml0">Leads</dd>
          <dd className="f3 f2-ns b ml0 ">{projectCount * 3}</dd>
        </dl>

        <dl className="db mr5 mt3">
          <dd className="f6 f5-ns  ml0">Activities</dd>
          <dd className="f3 f2-ns b ml0">{projectCount * 3 * 10} </dd>
        </dl>
      </>
    </article>
  );
};
Stats.propTypes = statPropTypes;
Stats.defaultProps = statDefaultProps;
