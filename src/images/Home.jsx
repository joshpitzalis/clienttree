import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  className: PropTypes.string.isRequired
}

const defaultProps = {}

// export default function Home({ className }) {
//   return (
//     <React.Fragment>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         className={className}
//       >
//         <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
//         <polyline points="9 22 9 12 15 12 15 22"></polyline>
//       </svg>
//     </React.Fragment>
//   );
// }

export default function Home ({ className }) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={className}
      >
        <rect x='2' y='7' width='20' height='14' rx='2' ry='2' />
        <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' />
      </svg>
    </>
  )
}

Home.propTypes = propTypes
Home.defaultProps = defaultProps
