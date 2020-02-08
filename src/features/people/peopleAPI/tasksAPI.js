import firebase from '../../../utils/firebase';

import { helpfulTaskRef, setTaskDetails } from './APIcalls';

export const handleAddTask = async ({
  taskName,
  myUid,
  theirUid,
  photoURL,
  dueDate,
  contactName,
  email,
}) => {
  const userEmail = await firebase.auth().currentUser.email;
  const newtask = helpfulTaskRef(myUid, theirUid);
  const taskId = newtask.id;

  return setTaskDetails({
    userId: myUid,
    userEmail,
    contactUid: theirUid,
    contactName,
    taskId,
    taskName,
    photoURL,
    dueDate,
    email,
  });
};

export const handleDeleteTask = (taskId, myUid, theirUid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(myUid)
    .collection('contacts')
    .doc(theirUid)
    .collection('helpfulTasks')
    .doc(taskId)
    .delete();

export const handleCompleteTask = (taskId, myUid, theirUid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(myUid)
    .collection('contacts')
    .doc(theirUid)
    .collection('helpfulTasks')
    .doc(taskId)
    .set(
      {
        dateCompleted: new Date(),
      },
      { merge: true }
    );

export const inCompleteTask = (taskId, myUid, theirUid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(myUid)
    .collection('contacts')
    .doc(theirUid)
    .collection('helpfulTasks')
    .doc(taskId)
    .set(
      {
        dateCompleted: null,
      },
      { merge: true }
    );

export const setActiveTaskCount = (myUid, theirUid, newActiveTaskCount) =>
  firebase
    .firestore()
    .collection('users')
    .doc(myUid)
    .collection('contacts')
    .doc(theirUid)
    .set(
      {
        activeTaskCount: newActiveTaskCount,
      },
      { merge: true }
    );

export const getActivitiesLeft = (myUid, completedFor) =>
  firebase
    .firestore()
    .collection('users')
    .doc(myUid)
    .collection('contacts')
    .doc(completedFor)
    .collection('helpfulTasks')
    .get()
    .then(coll => coll.docs.map(doc => doc.data()))
    .then(coll => coll.filter(task => !task.dateCompleted))
    .then(coll => coll.length);
