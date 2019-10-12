import { collection } from 'rxfire/firestore';
import { map, catchError } from 'rxjs/operators';
import firebase from '../../utils/firebase';
import { toast$ } from '../notifications/toast';

export const handleAddTask = (task, _myUid, _theirUid) => {
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
      },
      { merge: true }
    );
};

export const setFirebaseContactUpdate = async payload => {
  const {
    userId,
    contactId,
    name,
    summary,
    lastContacted,
    photoURL,
    imgString,
  } = payload;

  const newDoc = await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();

  const contactUid = contactId || newDoc.id;
  let downloadURL;

  if (imgString) {
    // upload the base 64 string to get an image url
    downloadURL = await firebase
      .storage()
      .ref()
      .child(`contacts/${contactUid}.png`)
      .putString(imgString, 'data_url', { contentType: 'image/png' })
      .then(({ ref }) => ref.getDownloadURL());
  }

  // create a default task for new contacts
  if (!contactId) {
    const task = await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .doc(contactUid)
      .collection('helpfulTasks')
      .doc();
    const taskId = task.id;

    await firebase
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
          name: `Touch base with ${name}`,
          dateCreated: new Date(),
          dateCompleted: null,
          connectedTo: userId,
        },
        { merge: true }
      );

    await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('contacts')
      .doc(contactUid)
      .set(
        {
          name,
          summary,
          uid: contactUid,
          lastContacted,
          photoURL: photoURL || downloadURL,
          activeTaskCount: 1,
        },
        { merge: true }
      );
    return;
  }

  await firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .set(
      {
        name,
        summary,
        uid: contactUid,
        lastContacted,
        photoURL: photoURL || downloadURL,
      },
      { merge: true }
    );
};

export const handleContactDelete = (name, uid, userId) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid)
    .delete();

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
// export const getFirebaseContacts = uid =>
//   collection(
//     firebase
//       .firestore()
//       .collection('users')
//       .doc(uid)
//       .collection('contacts')
//   )
//     .pipe(
//       map(docs => docs.map(d => d.data())),
//       catchError(error =>
//         toast$.next({
//           type: 'ERROR',
//           message: error.message || error,
//         })
//       )
//     )
//     .subscribe(network => setContacts(network));
