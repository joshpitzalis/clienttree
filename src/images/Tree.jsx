import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  classNames: PropTypes.string.isRequired,
};

const defaultProps = {};

export default function Tree({ classNames }) {
  return (
    <div className={`${classNames}`}>
      <svg
        width="29px"
        height="30px"
        viewBox="0 0 36 40"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Client Tree </title>
        <desc>Client Tree Logo</desc>
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="Tree-Copy" transform="translate(2.000000, 2.000000)">
            <path
              d="M9.99406028,30 C9.60014921,30 9.23291514,29.8848348 8.92366983,29.6869263 C6.07147852,28.8022811 4,26.1430504 4,23 C4,22.6509497 4.02554782,22.3078664 4.07487555,21.972518 C1.6424391,20.6002521 0,17.9919321 0,15 C0,10.581722 3.581722,7 8,7 C8.55385865,3.05380925 11.9203016,0 16,0 C20.0796984,0 23.4461414,3.05380925 23.9381354,7.00023421 C28.418278,7 32,10.581722 32,15 C32,17.9919321 30.3575609,20.6002521 27.9251245,21.972518 C27.9744522,22.3078664 28,22.6509497 28,23 C28,26.1413077 25.9308179,28.7993321 23.0810736,29.6854532 C22.7706516,29.8845373 22.4015678,30 22.0059397,30"
              id="Oval-3-Copy"
              stroke="#758656"
              strokeWidth="4"
              strokeLinecap="round"
            ></path>
            <rect
              id="Rectangle-42"
              fill="#758656"
              fillRule="nonzero"
              x="9"
              y="28"
              width="15"
              height="4"
              rx="2"
            ></rect>
            <rect
              id="Rectangle-19"
              fill="#758656"
              fillRule="nonzero"
              x="14"
              y="12"
              width="4"
              height="26"
              rx="2"
            ></rect>
            <rect
              id="Rectangle-20"
              fill="#758656"
              fillRule="nonzero"
              transform="translate(20.000000, 18.000000) rotate(45.000000) translate(-20.000000, -18.000000) "
              x="18"
              y="12"
              width="4"
              height="12"
              rx="2"
            ></rect>
          </g>
        </g>
      </svg>
    </div>
  );
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;
