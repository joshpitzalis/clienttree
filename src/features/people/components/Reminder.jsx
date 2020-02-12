import React from 'react';
import { useSelector } from 'react-redux';
import { Datepicker, DatepickerContainer } from '@duik/it';
import format from 'date-fns/format';

export const ReminderCreator = ({
  myUid,
  theirUid,
  handleAddingTask,
  photoURL,
  onClose,
}) => {
  const contact = useSelector(
    store =>
      store.contacts && store.contacts.find(person => person.uid === theirUid)
  );
  const [email] = React.useState(contact ? contact.email : '');
  const [name, setName] = React.useState(contact && contact.name);
  const [task, setTask] = React.useState('');
  const [date, setDate] = React.useState(+new Date() + 604800000);
  const [error, setError] = React.useState('');
  // if you have the contacts uid then prefill the name field and disable it
  const handleAddReminder = (contactName, taskName, dueDate) => {
    handleAddingTask({
      taskName,
      myUid,
      theirUid,
      photoURL,
      dueDate,
      contactName,
      email,
    });
  };

  return (
    <div className="center pt3 pb4">
      <form
        className=""
        onSubmit={e => {
          e.stopPropagation();
          e.preventDefault();
          // handleAddingTask(task, myUid, theirUid, photoURL);
          handleAddReminder(name, task, date);
          setTask('');
          onClose();
        }}
      >
        <fieldset
          id="help"
          className="ba b--transparent ph0 mh0"
          data-testid="reminderBox"
        >
          <legend className="ph0 mh0 fw6 ">Follow up with...</legend>
          <div className="">
            <label className="db fw4 lh-copy f6 " htmlFor="name">
              {/* <span className="db b">Ways you can help this person</span> */}
              <input
                disabled
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2"
                placeholder="Who?"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="">
            <label className="db fw4 lh-copy f6 " htmlFor="task">
              {/* <span className="db b">Ways you can help this person</span> */}
              <input
                className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb2 "
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
        className="db border-box hover-black w-100 measure-narrow ba b--black-20 pa3 br2 mb3"
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
