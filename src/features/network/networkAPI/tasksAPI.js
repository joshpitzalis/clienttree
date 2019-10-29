import firebase from '../../../utils/firebase';

export const handleAddTask = (task, _myUid, _theirUid, photoURL) => {
  const newtask = firebase
    .firestore()
    .collection('users')
    .doc(_myUid)
    .collection('contacts')
    .doc(_theirUid)
    .collection('helpfulTasks')
    .doc();

  const taskId = task.id || newtask.id;

  return firebase
    .firestore()
    .collection('users')
    .doc(_myUid)
    .collection('contacts')
    .doc(_theirUid)
    .collection('helpfulTasks')
    .doc(taskId)
    .set(
      {
        taskId,
        name: task,
        dateCreated: new Date(),
        dateCompleted: null,
        connectedTo: _myUid,
        completedFor: _theirUid,
        photoURL,
      },
      { merge: true }
    );
};

export const getTasks = (task, _myUid, _theirUid) => {
  const newtask = firebase
    .firestore()
    .collection('users')
    .doc(_myUid)
    .collection('contacts')
    .doc(_theirUid)
    .collection('helpfulTasks')
    .doc();

  const taskId = task.id || newtask.id;

  return firebase
    .firestore()
    .collection('users')
    .doc(_myUid)
    .collection('contacts')
    .doc(_theirUid)
    .collection('helpfulTasks')
    .doc(taskId)
    .set(
      {
        taskId,
        task,
        dateCreated: new Date(),
        dateCompleted: null,
      },
      { merge: true }
    );
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

export const setActiveTaskCount = (myUid, theirUid, newActiveTaskCount) => {
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
};

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
