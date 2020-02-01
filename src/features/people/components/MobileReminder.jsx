import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
// import fromUnixTime from 'date-fns/fromUnixTime';
import { assert } from 'chai';
import { Datepicker, DatepickerContainer } from '@duik/it';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import { useImmerReducer } from 'use-immer';
import { useSelector, useDispatch } from 'react-redux';
import AvatarGenerator from 'react-avatar-generator';
import { AutoComplete } from 'antd';
import { collection } from 'rxfire/firestore';
import { map, catchError } from 'rxjs/operators';
import { toast$ } from '../../notifications/toast';
import { handleAddTask } from '../peopleAPI';
import firebase from '../../../utils/firebase';

// state visualisation:
// https://xstate.js.org/viz/?gist=7925b7b6f194989221d4a2da62731937

const check = state => ({ getByTestId }) => {
  assert.ok(getByTestId(state));
};

export const taskMachine = Machine({
  id: 'task',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPENED: 'open',
      },
      meta: {
        test:
          // check('mobileAddreminder'),
          ({ getByTestId }) => {
            assert.ok(getByTestId('mobileAddreminder'));
          },
      },
    },
    open: {
      on: {
        CLOSED: 'closed',
      },
      meta: {
        test: ({ getByTestId }) => {
          assert.ok(getByTestId('open'));
        },
      },
    },
  },
});

export const MobileReminder = ({ myUid }) => {
  const [current, send] = useMachine(taskMachine, {
    actions: {
      handleAddingTask: (ctx, { payload }) =>
        handleAddTask(payload).catch(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        ),
    },
  });

  if (current.matches('closed')) {
    return (
      <button
        type="button"
        data-testid="mobileAddreminder"
        onClick={() => send('OPENED')}
        className="btn2 ph5 pv4 bn pointer br1 grow b mt4 dn-ns center"
        style={{ maxWidth: '20em' }}
      >
        Add A Reminder
      </button>
    );
  }

  if (current.matches('open')) {
    return (
      <ReminderCreator
        send={send}
        handleAddingTask={handleAddTask}
        myUid={myUid}
      />
    );
  }
};

const ReminderCreator = ({ myUid, handleAddingTask, send }) => {
  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(myUid)
    .collection('contacts')
    .doc();

  const [theirUid, setTheirUid] = React.useState(newDoc.id);

  const contacts = useSelector(store => store.contacts);

  const [name, setName] = React.useState('');
  const [task, setTask] = React.useState('');
  const [date, setDate] = React.useState(+new Date() + 604800000);

  const photoURL = `https://ui-avatars.com/api/?name=${name}`;

  const [allContacts, setAllContacts] = React.useState([]);
  const dispatch = useDispatch();

  const handleAddReminder = (contactName, taskName, dueDate, userId) => {
    const existingContact = contacts.find(contact => contact.name === name);

    handleAddingTask({
      taskName,
      myUid,
      theirUid,
      photoURL:
        existingContact && existingContact.photoURL
          ? existingContact.photoURL
          : photoURL,
      dueDate,
      contactName,
    });

    const payload = {
      userId,
      uid: theirUid,
      name,
      summary: '',
      lastContacted: +new Date(),
      photoURL,
      downloadURL: '',
      notes: {
        9007199254740991: {
          id: 9007199254740991,
          text: '',
          lastUpdated: 9007199254740991,
        },
      },
      tracked: false,
    };

    if (!existingContact) {
      dispatch({
        type: 'ONBOARDING_STEP_COMPLETED',
        payload: { userId: myUid, onboardingStep: 'addedSomeone' },
      });
      dispatch({
        type: 'people/updateForm',
        payload,
      });
    }
  };

  const [error, setError] = React.useState('');

  return (
    <div className="center pt3 pb4" data-testid="open">
      <form
        className=""
        onSubmit={e => {
          e.stopPropagation();
          e.preventDefault();
          if (!name) {
            setError('Tasks must be connected to someone.');
            return;
          }
          if (!task) {
            setError('Tasks must have a name.');
            return;
          }

          handleAddReminder(name, task, date, myUid);
          setTask('');
          setName('');
          setDate(+new Date() + 604800000);
          send('CLOSED');
        }}
      >
        <fieldset
          id="help"
          className="ba b--transparent ph0 mh0"
          data-testid="reminderBox"
        >
          <legend className="ph0 mh0 fw6 ">Follow up with...</legend>
          <div className="autoComplete">
            <AutoComplete
              dataSource={allContacts}
              onSelect={value => {
                setName(value);
                const existingContact = contacts.find(
                  contact => contact.name === value
                );
                setTheirUid(existingContact.uid);
              }}
              style={{
                backgroundColor: 'hsl(0, 0%, 88%)',
                border: 'none',
                lineHeight: '1.15',
                borderRadius: '.25rem',
                display: 'block',
                width: '100%',
                padding: '.5rem 0',
                margin: '0 auto .5rem auto',
                maxWidth: '20em',
              }}
              onSearch={searchText => {
                const results = !searchText
                  ? []
                  : contacts &&
                    contacts
                      .filter(
                        item =>
                          item.name &&
                          item.name
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                      )
                      .map(item => item.name);
                setAllContacts(results);
              }}
              placeholder="Who?"
              value={name}
              onChange={value => {
                setError('');
                setName(value);
              }}
            ></AutoComplete>
          </div>
          <div className="">
            <label className="db fw4 lh-copy f6" htmlFor="task">
              <input
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2 center"
                placeholder="About What?"
                type="text"
                name="task"
                id="task"
                value={task}
                onChange={e => {
                  setError('');
                  setTask(e.target.value);
                }}
              />
            </label>
          </div>
          <div className="mb2">
            <DateBox date={date} setDate={setDate} setError={setError} />
          </div>
          {error && <small className="red center db mb3"> {error}</small>}
          <input
            type="submit"
            value="Create Reminder"
            className="btn2 w-100 pv3 bn pointer br1 grow b mb3"
          />
        </fieldset>
      </form>
      <button
        type="button"
        onClick={() => send('CLOSED')}
        className="bn pointer bg-transparent"
      >
        Close
      </button>
    </div>
  );
};

function DateBox({ date, setDate, setError }) {
  const [visible, setVisible] = React.useState(false);

  return visible ? (
    <DatepickerContainer>
      <Datepicker
        value={new Date(date)}
        onDateChange={value => {
          setError('');
          setDate(+new Date(value));
          setVisible(false);
        }}
        minDate={new Date()}
      />
    </DatepickerContainer>
  ) : (
    <label className="db fw4 lh-copy f6 " htmlFor="date">
      <input
        className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb3 center"
        placeholder="When?"
        type="text"
        name="date"
        id="date"
        onClick={() => setVisible(true)}
        value={format(date, 'EEEE do MMMM yyyy')}
        onChange={e => setDate(e.target.value)}
      />
    </label>
  );
}

// // autocoplete to find existing users

// function reducer(draft, action) {
//   const { type, payload } = action;

//   switch (type) {
//     case 'nameUpdated':
//       draft.name = payload;
//       return draft;
//     case 'activityUpdated':
//       draft.activity = payload;
//       return draft;
//     case 'formSubmitted':
//       draft.activity = '';
//       draft.name = '';
//       return draft;
//     default:
//       return draft;
//   }
// }

// const addPropTypes = {
//   setUser: PropTypes.func.isRequired,
//   userId: PropTypes.string.isRequired,
// };
// const addDefaultProps = {};

// export function AddBox({ setUser, userId }) {
//   const [state, dispatch] = useImmerReducer(reducer, {
//     name: '',
//     activity: '',
//   });
//   const { name, activity } = state;

//   const avatarRef = React.useRef(null);

//   const [allContacts, setAllContacts] = React.useState([]);

//   React.useEffect(() => {
//     const getAllContacts = collection(
//       firebase
//         .firestore()
//         .collection('users')
//         .doc(userId)
//         .collection('contacts')
//     )
//       .pipe(
//         map(docs =>
//           docs.map(d => {
//             const { name: text, photoURL, uid: value } = d.data();
//             const item = {
//               value,
//               text,
//               photoURL,
//             };

//             return item;
//           })
//         ),
//         catchError(error =>
//           toast$.next({
//             type: 'ERROR',
//             message: error.message || error,
//           })
//         )
//       )
//       .subscribe(network => setAllContacts(network));

//     return () => getAllContacts.unsubscribe();
//   }, [userId]);

//   const [contacts, setContacts] = React.useState([]);

//   const [contactId, setContactId] = React.useState('');

// //   return (
// //     <form
// //       className="center mw5 mw6-ns br3 hidden ba b--black-10 mv4"
// //       data-testid="addBox"
// //       onSubmit={async e => {
// //         e.preventDefault();
// //         const imgString = await avatarRef.current.getImageData();

// //         setUser({
// //           userId,
// //           name,
// //           summary: '',
// //           lastContacted: '',
// //           taskName: activity,
// //           imgString,
// //           // if existing user
// //           photoURL: '',
// //           contactId,
// //           uid: '',
// //         });

// //         dispatch({
// //           type: 'formSubmitted',
// //         });
// //       }}
// //     >
// //       <h1 className="f4 bg-near-white br3 br--top black-60 mv0 pv2 ph3 flex items-center">
// //         <AvatarGenerator
// //           ref={avatarRef}
// //           height="25"
// //           width="25"
// //           colors={['#333', '#222', '#ccc']}
// //         />{' '}
// //         Add an Activity
// //       </h1>

// //       <div className="pa3 bt b--black-10">
// //         {/* <label className="db fw4 lh-copy f6 " htmlFor="name"> */}
// //         {/* <span className="b">Name</span> */}

// //         {/* <input
// //             className="b pa2 input-reset ba bg-transparent center br2 b--black-20"
// //             placeholder="Name..."
// //             type="text"
// //             name="name"
// //             id="name"
// //             value={name}
// //             onChange={e =>
// //               dispatch({
// //                 type: 'nameUpdated',
// //                 payload: e.target.value,
// //               })
// //             }
// //           /> */}
// //         {/* </label> */}
// //         <label className="db fw4 lh-copy f6 mv3" htmlFor="activity">
// //           {/* <span className="b">Activity</span> */}
// //           <input
// //             className="b pa2 input-reset ba bg-transparent center br2 b--black-20"
// //             placeholder="Activity..."
// //             type="text"
// //             name="activity"
// //             id="activity"
// //             value={activity}
// //             onChange={e =>
// //               dispatch({
// //                 type: 'activityUpdated',
// //                 payload: e.target.value,
// //               })
// //             }
// //           />
// //         </label>
// //         <input type="submit" value="submit" data-testid="addBoxSubmitButton" />
// //       </div>
// //     </form>
// //   );
// // }

// // AddBox.propTypes = addPropTypes;
// // AddBox.defaultProps = addDefaultProps;
