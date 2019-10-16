import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {};

const defaultProps = {};

export default function StatsBox() {
  return (
    <article className="pt5 w5 center bg-white br3 pv3 pv4-ns mv3 pl2">
      <div className="tc mb5">
        <h1 className="f4 tl">
          $45,781 <small className="fw5">/ 100K</small>
        </h1>
      </div>

      <dl className="db mr5   ">
        <dd className="f6 f5-ns b ml0">
          Projects <span className="fw4">(3:1)</span>
        </dd>
        <dd className="f3 f2-ns b ml0">12 </dd>
      </dl>
      <dl className="db mr5 mt3">
        <dd className="f6 f5-ns b ml0">
          Proposals <span className="fw4">(3:1)</span>
        </dd>
        <dd className="f3 f2-ns b ml0">26 </dd>
      </dl>
      <dl className="db mr5 mt3">
        <dd className="f6 f5-ns b ml0">
          Leads <span className="fw4">(5:1)</span>
        </dd>
        <dd className="f3 f2-ns b ml0 ">70 </dd>
      </dl>
      <dl className="db mr5 mt3">
        <dd className="f6 f5-ns b ml0 fw4">326 Activities left</dd>
        {/* <dd className="f3 f2-ns b ml0">326 </dd> */}
      </dl>

      <small className="o-50 pointer">(Edit)</small>
    </article>
  );
}

StatsBox.propTypes = propTypes;
StatsBox.defaultProps = defaultProps;
