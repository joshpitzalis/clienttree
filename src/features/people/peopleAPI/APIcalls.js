import firebase from '../../../utils/firebase'

export const helpfulTaskRef = (userId, contactUid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .collection('helpfulTasks')
    .doc()

export const newDocRef = userId =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc()

export const setTaskDetails = ({
  userId,
  userEmail,
  contactUid,
  contactName,
  taskId,
  taskName,
  photoURL,
  dueDate
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
        photoURL,
        userId,
        userEmail,
        contactName,
        dueDate
      },
      { merge: true }
    )
