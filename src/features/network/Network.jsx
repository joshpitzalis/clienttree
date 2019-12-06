import React from 'react';
import PropTypes from 'prop-types';
import PieChart from 'react-minimal-pie-chart';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
// import format from 'date-fns/format';
import { CSSTransition } from 'react-transition-group';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import fromUnixTime from 'date-fns/fromUnixTime';
import { Button } from '@duik/it';
import Portal from '../../utils/Portal';
import './networkAnimations.css';
import { Modal } from './components/ContactModal';
import { NetworkContext } from './NetworkContext';
import firebase from '../../utils/firebase';

const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

function isValidDate(timestamp) {
  return new Date(timestamp).getTime() > 0;
}

export function Network({ uid }) {
  const [visible, setVisibility] = React.useState(false);

  const { contacts } = React.useContext(NetworkContext);

  const [selectedUser, setSelectedUser] = React.useState('');

  const [tasksCompleted, setTasksCompleted] = React.useState(0);

  React.useEffect(() => {
    const subscription = collection(
      firebase
        .firestore()
        .collectionGroup('helpfulTasks')
        .where('connectedTo', '==', uid)
        .where('dateCompleted', '>', new Date(0))
    )
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe(tasks => setTasksCompleted(tasks.length));
    return () => subscription.unsubscribe();
  }, [uid]);

  return (
    <>
      {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
            setSelectedUser('');
          }}
        >
          <Modal
            setVisibility={setVisibility}
            uid={uid}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false);
              setSelectedUser('');
            }}
          />
        </Portal>
      )}
      {/* <Charts tasksCompleted={tasksCompleted} contacts={contacts} /> */}
      <div
        className="flex items-center lh-copy pa3 ph0-l bb b--black-10 "
        data-testid="outreachPage"
      >
        <AddButton
          setVisibility={setVisibility}
          contactCount={contacts.filter(c => c.uid).length}
        />
      </div>

      <ul className="list pl0 mt0">
        {contacts &&
          contacts.map(
            contact =>
              contact.uid && (
                <li key={contact.uid}>
                  <div
                    className="flex items-center lh-copy pa3 ph0-l bb b--black-10 pointer"
                    tabIndex={-1}
                    role="button"
                    onClick={() => {
                      setSelectedUser(contact.uid);
                      setVisibility(true);
                    }}
                    onKeyPress={() => {
                      setSelectedUser(contact.uid);
                      setVisibility(true);
                    }}
                  >
                    <img
                      alt={contact.name}
                      className="w2 h2 w3-ns h3-ns br-100"
                      src={contact.photoURL}
                    />
                    <div className="pl3 flex-auto">
                      <span className="f6 db black-70 b">{contact.name}</span>
                      <span className="f6 db black-70 i">
                        {contact.lastContacted &&
                        isValidDate(fromUnixTime(contact.lastContacted))
                          ? `Last contacted ${
                              formatDistanceToNow(
                                fromUnixTime(contact.lastContacted),
                                { addSuffix: true }
                              )

                              // format(
                              //   fromUnixTime(contact.lastContacted),
                              //   'Do MMM YYYY'
                              // )
                            }`
                          : null}
                      </span>
                    </div>
                    <div>
                      {!!contact.activeTaskCount &&
                        Array(contact.activeTaskCount)
                          .fill(null)
                          .map((count, index) => (
                            <div
                              key={`${index}+${+new Date()}`}
                              className="taskStyle "
                            />
                          ))}
                    </div>
                  </div>
                </li>
              )
          )}
      </ul>
    </>
  );
}
Network.propTypes = networkPropTypes;
Network.defaultProps = networkDefaultProps;

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

function AddButton({ setVisibility, contactCount }) {
  const [revealSupportText, setRevealSupportText] = React.useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setVisibility(true)}
        className="link ba ph3 pv2 mb2 db black-70 pointer br1"
        onMouseEnter={() => setRevealSupportText(true)}
        onMouseLeave={() => setRevealSupportText(false)}
      >
        Add Someone New
      </button>
      <CSSTransition
        in={contactCount < 3 && revealSupportText}
        timeout={500}
        classNames="fadeIn"
        unmountOnExit
      >
        <p className="black-50 db i">
          {
            {
              0: 'Just start by adding 3 people that you have been meaning to keep in touch with for a while.',
              1: 'Almost there. Add two more people. You can do it! 🙌 🙌 🙌',
              2: 'Add One more person. You got this! 🎉 🎉 🎉',
            }[contactCount]
          }
        </p>
      </CSSTransition>
    </div>
  );
}

AddButton.propTypes = {
  setVisibility: PropTypes.func.isRequired,
  contactCount: PropTypes.number,
};
AddButton.defaultProps = {
  contactCount: 0,
};
