import React from 'react'
import { collection } from 'rxfire/firestore'
import { map } from 'rxjs/operators'
import { useDispatch } from 'react-redux'
import firebase from '../../../utils/firebase'
// import Modal from './ContactModal';
// import Portal from '../../../utils/Portal';
import { TaskBox } from './TaskBox'

/** @param {{
  myUid: string,
  contactSelected: string
  }} [Props] */
/* eslint-disable react/prop-types */
export const SpecificTaskList = ({ myUid, contactSelected }) => {
  const [helpfulTasks, setHelpfulTasks] = React.useState([])

  React.useEffect(() => {
    const subscription = collection(
      firebase
        .firestore()
        .collection('users')
        .doc(myUid)
        .collection('contacts')
        .doc(contactSelected)
        .collection('helpfulTasks')
        .orderBy('dueDate')
    )
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe(tasks => tasks && setHelpfulTasks(tasks))
    return () => subscription.unsubscribe()
  }, [contactSelected, myUid])

  const [, setVisibility] = React.useState(false)

  const [, setSelectedUser] = React.useState('')
  const dispatch = useDispatch()
  return (
    <div data-testid='specificTaskList'>
      {/* i think this feature was for adding teh next task when there are no tasks left */}
      {/* {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
            setSelectedUser('');
          }}
        >
          <Modal
            setVisibility={setVisibility}
            uid={myUid}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false);
              setSelectedUser('');
            }}
          />
        </Portal>
      )} */}

      {helpfulTasks &&
        helpfulTasks.map(
          ({ taskId, name, dateCompleted, completedFor, photoURL, dueDate }) =>
            completedFor && (
              <TaskBox
                key={taskId}
                taskId={taskId}
                name={name}
                dateCompleted={dateCompleted}
                myUid={myUid}
                completedFor={completedFor}
                setSelectedUser={setSelectedUser}
                setVisibility={setVisibility}
                photoURL={photoURL}
                dispatch={dispatch}
                dueDate={dueDate}
              />
            )
        )}
    </div>
  )
}
