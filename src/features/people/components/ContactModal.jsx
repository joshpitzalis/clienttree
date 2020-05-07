import React from 'react'
import PropTypes from 'prop-types'
import { doc } from 'rxfire/firestore'
import { toast$ } from '../../notifications/toast'
import { handleAddTask } from '../peopleAPI'
import firebase from '../../../utils/firebase'
import { ReminderCreator } from './Reminder'

const modalPropTypess = {
  uid: PropTypes.string.isRequired,
  selectedUserUid: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
  // incrementStats: PropTypes.func,
}
const modalDefaultPropss = {
  // incrementStats: handleTracking,
}
/* eslint-disable react/prop-types */
const Modal = ({
  uid,
  selectedUserUid,
  onClose
  // incrementStats = handleTracking,
}) => {
  const [state, setState] = React.useState({
    userId: uid,
    name: '',
    summary: '',
    tracked: false,
    lastContacted: '',
    contactId: '',
    photoURL: '',
    imgString: '',
    activeTaskCount: 0,
    email: ''
  })

  React.useEffect(() => {
    if (selectedUserUid) {
      const subscription = doc(
        firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .collection('contacts')
          .doc(selectedUserUid)
      ).subscribe(user => {
        setState({ ...user.data() })
      })
      return () => subscription.unsubscribe()
    }
  }, [selectedUserUid, uid])

  const handleAddingTask = ({
    taskName,
    myUid,
    theirUid,
    photoURL,
    dueDate,
    contactName,
    email
  }) => {
    handleAddTask({
      taskName,
      myUid,
      theirUid,
      photoURL,
      dueDate,
      contactName,
      email
    }).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    )
  }

  return (
    <div data-testid="contactModal" className="z-999 relative">
      <div className="flex">
        <div className="center" style={{ width: '258px' }}>
          <ReminderCreator
            myUid={uid}
            theirUid={selectedUserUid}
            handleAddingTask={handleAddingTask}
            photoURL={state.photoURL}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  )
}
Modal.propTypes = modalPropTypess
Modal.defaultProps = modalDefaultPropss

export default Modal
