import React from 'react';
import PropTypes from 'prop-types';
import PieChart from 'react-minimal-pie-chart';

function Charts({ contacts, tasksCompleted }) {
  return (
    <div className="flex justify-around items-center mb4">
      <PieChart
        className="w-30"
        animate
        background="#bfbfbf"
        animationDuration={1500}
        animationEasing="ease-in"
        cx={50}
        cy={50}
        data={[
          {
            color: '#E38627',
            title: 'One',
            value: contacts && contacts.filter(item => !!item.uid).length,
          },
        ]}
        totalValue={150}
        label={false}
        lengthAngle={360}
        lineWidth={100}
        onClick={undefined}
        onMouseOut={undefined}
        onMouseOver={undefined}
        paddingAngle={0}
        radius={42}
        ratio={1}
        rounded={false}
        startAngle={270}
      />
      <dl className="db dib-l w-auto-l lh-title mr6-l pt5">
        <dd className="f6 fw4 ml0">Activities Completed</dd>
        <dd className="f2 f-subheadline-l fw6 ml0">{tasksCompleted}</dd>
      </dl>
    </div>
  );
}
Charts.propTypes = {
  contacts: PropTypes.array,
  tasksCompleted: PropTypes.array,
};
Charts.defaultProps = {};
