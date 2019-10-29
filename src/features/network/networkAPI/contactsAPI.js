import firebase from '../../../utils/firebase';

const contactRef = (userId, uid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid);

const helpfulTaskRef = (userId, contactUid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(contactUid)
    .collection('helpfulTasks')
    .doc();

const getImageDownloadURL = (contactUid, imgString) =>
  firebase
    .storage()
    .ref()
    .child(`contacts/${contactUid}.png`)
    .putString(imgString, 'data_url', { contentType: 'image/png' })
    .then(({ ref }) => ref.getDownloadURL());

const setTaskDetails = ({
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

const setContactDetails = ({
  userId,
  contactUid,
  name,
  summary,
  lastContacted,
  photoURL,
  downloadURL,
}) =>
  contactRef(userId, contactUid).set(
    {
      name,
      summary,
      uid: contactUid,
      lastContacted: lastContacted || null,
      photoURL: downloadURL || photoURL,
      activeTaskCount: 1,
    },
    { merge: true }
  );

const payloads = async (
  userId,
  uid,
  contactId,
  name,
  summary,
  lastContacted,
  photoURL,
  imgString
) => {
  let downloadURL;

  const newDoc = firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc();

  const contactUid = contactId || uid || newDoc.id;

  // upload the base 64 string to get an image url
  if (imgString) {
    downloadURL = await getImageDownloadURL(contactUid, imgString);
  }

  const contactPayload = {
    userId,
    contactUid,
    name,
    summary,
    lastContacted,
    photoURL,
    downloadURL,
  };

  const task = helpfulTaskRef(userId, contactUid);

  const taskId = task.id;

  const taskPayload = {
    userId,
    contactUid,
    taskId,
    photoURL,
    downloadURL,
  };

  return [contactPayload, taskPayload, contactUid];
};

export const setFirebaseContactUpdate = async ({
  userId,
  contactId,
  uid,
  name,
  summary,
  lastContacted,
  photoURL,
  imgString,
  taskName,
}) => {
  // payloads
  const [contactPayload, taskPayload] = await payloads(
    userId,
    uid,
    contactId,
    name,
    summary,
    lastContacted,
    photoURL,
    imgString
  );

  // create a specific task for new contacts
  if (taskName) {
    await setTaskDetails({ ...taskPayload, taskName });
    await setContactDetails(contactPayload);
    return;
  }

  // create a default task for new contacts
  if (!contactId) {
    await setTaskDetails({
      ...taskPayload,
      taskName: `Touch base with ${name}`,
    });
    await setContactDetails(contactPayload);
    return;
  }

  await setContactDetails(contactPayload);
};

export const handleContactDelete = (uid, userId) =>
  contactRef(userId, uid).delete();
