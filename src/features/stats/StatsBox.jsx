import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Portal from '../../utils/Portal';
import { GeneralForm } from './InputForm';

const propTypes = {
  userId: PropTypes.string.isRequired,
};

const defaultProps = {};

export default function StatsBox({ userId }) {
  const [visible, setVisibility] = React.useState(false);
  const userStats = useSelector(store => store.user);
  const { goal, income, average } = userStats;

  const projectCount = Math.ceil((goal - income) / average);

  return (
    <>
      {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
          }}
        >
          {/* <InvoiceForm  /> */}
          <GeneralForm
            userId={userId}
            onClose={() => {
              setVisibility(false);
            }}
            userStats={userStats}
          />
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
            {`$${income}K`}
            <small className="fw5">/ {`${goal}K`}</small>
          </h1>
        </div>

        <>
          <dl className="db mr5">
            <dd className="f6 f5-ns b ml0">Projects</dd>
            <dd className="f3 f2-ns b ml0">{projectCount}</dd>
          </dl>

          <dl className="db mr5 mt3">
            <dd className="f6 f5-ns b ml0">Leads</dd>
            <dd className="f3 f2-ns b ml0 ">{projectCount * 3}</dd>
          </dl>

          <dl className="db mr5 mt3">
            <dd className="f6 f5-ns b ml0">Activities</dd>
            <dd className="f3 f2-ns b ml0">{projectCount * 3 * 10} </dd>
          </dl>
        </>
      </article>
    </>
  );
}

StatsBox.propTypes = propTypes;
StatsBox.defaultProps = defaultProps;

// function InvoiceForm() {
//   const [state, setState] = React.useState({
//     date: '',
//     project: '',
//     amount: '',
//   });
//   return (
//     <form
//       className="measure center"
//       data-testid="contactModal"
//       onSubmit={() => {}}
//     >
//       <fieldset id="contact" className="ba b--transparent ph0 mh0 tl">
//         <legend className="f4 fw6 ph0 mh0 dn">Profile</legend>
//         <div className="flex justify-center">
//           <div className="w-50">
//             <Input
//               setState={setState}
//               state={state}
//               value={state.invoice}
//               name="amount"
//               placeholder="How much did you just bill for?"
//             />

//             <Input
//               setState={setState}
//               state={state}
//               value={state.project}
//               name="project"
//               placeholder="Whats the name of the project?"
//             />
//             <Input
//               setState={setState}
//               state={state}
//               value={state.date}
//               name="date"
//               placeholder="When was this paid?"
//             />
//           </div>
//         </div>
//       </fieldset>
//       <div className="mt3 flex justify-around items-center">
//         <input
//           className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
//           type="submit"
//           value="Add Payment"
//         />
//       </div>
//     </form>
//   );
// }
