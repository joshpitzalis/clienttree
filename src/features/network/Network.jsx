import React from 'react';
import PropTypes from 'prop-types';
import PieChart from 'react-minimal-pie-chart';
import Portal from '../../utils/Portal';
import Plus from '../../images/Plus';
import { Modal } from './components/ContactModal';
import { NetworkContext } from './NetworkContext';

const networkPropTypes = {
  uid: PropTypes.string.isRequired,
};
const networkDefaultProps = {};

export function Network({ uid }) {
  const [visible, setVisibility] = React.useState(false);

  const { contacts } = React.useContext(NetworkContext);

  const [selectedUser, setSelectedUser] = React.useState('');

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
              value: contacts.filter(item => !!item.uid).length,
            },
          ]}
          totalValue={150}
          label={false}
          // labelPosition={112}
          // labelStyle={{
          //   fontFamily: 'sans-serif',
          //   fontSize: '5px',
          // }}
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
          <dd className="f2 f-subheadline-l fw6 ml0">24</dd>
        </dl>
      </div>
      <div
        className="flex items-center lh-copy pa3 ph0-l bb b--black-10 "
        data-testid="outreachPage"
      >
        <div id="viz1"></div>
        <button
          className=" flex items-center pointer link bn"
          type="button"
          onClick={() => setVisibility(true)}
        >
          <Plus className="black-70" />
          <div className="pl2 ">
            <span className="f6 db black-70">Add someone to your network</span>
            {/* <span className="f6 db black-70">
            Bulk Import contacts from Gmail
          </span> */}
          </div>
        </button>
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
                          `Last contacted ${contact.lastContacted}`}
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
