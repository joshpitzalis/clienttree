import firebase from '../../../utils/firebase';

export {
  handleAddTask,
  handleDeleteTask,
  handleCompleteTask,
  inCompleteTask,
  setActiveTaskCount,
  getActivitiesLeft,
} from './tasksAPI';

export { setFirebaseContactUpdate, handleContactDelete } from './contactsAPI';

export const helpfulTaskRef = (userId, contactUid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .collection('helpfulTasks')
    .doc();

export const setTaskDetails = ({
  userId,
  contactUid,
  taskId,
  taskName,
  photoURL,
  downloadURL,
}) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .collection('helpfulTasks')
    .doc(taskId)
    .set(
      {
        taskId,
        name: taskName,
        dateCreated: new Date(),
        dateCompleted: null,
        connectedTo: userId,
        completedFor: contactUid,
        photoURL: downloadURL || photoURL,
      },
      { merge: true }
    );
