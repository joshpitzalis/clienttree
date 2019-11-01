import firebase from '../../../utils/firebase';
import { helpfulTaskRef, setTaskDetails } from './APIcalls';

const contactRef = (userId, uid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid);

const getImageDownloadURL = (contactUid, imgString) =>
  firebase
    .storage()
    .ref()
    .child(`contacts/${contactUid}.png`)
    .putString(imgString, 'data_url', { contentType: 'image/png' })
    .then(({ ref }) => ref.getDownloadURL());

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

  const basePayload = {
    userId,
    contactUid,
    photoURL,
    downloadURL,
  };

  const contactPayload = {
    ...basePayload,
    name,
    summary,
    lastContacted,
  };

  const task = helpfulTaskRef(userId, contactUid);
  const taskId = task.id;
  const taskPayload = {
    ...basePayload,
    taskId,
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
    console.log('new contacts');
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
