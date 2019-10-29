import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp()

const db = admin.firestore()

export const someoneSignedUp = functions.auth.user().onCreate(async (user) => {
  const payload = {
    photoURL:
      'https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg',
    taskName: 'Send Josh a blank email with your new signature',
    userId: user.uid,
    name: 'Josh',
    summary: 'Built Client Tree. Specialises in building educational web apps.',
  };

  const newDoc = db
    .collection('users')
    .doc(user.uid)
    .collection('contacts')
    .doc();

  const contactId = newDoc.id

  const task = db
    .collection('users')
    .doc(user.uid)
    .collection('contacts')
    .doc(contactId)
    .collection('helpfulTasks')
    .doc();

  const taskId = task.id;


  await db.collection('users')
    .doc(user.uid)
    .collection('contacts')
    .doc(contactId)
    .collection('helpfulTasks')
    .doc(taskId)
    .set(
      {
        taskId,
        name: payload.taskName,
        dateCreated: new Date(),
        dateCompleted: null,
        connectedTo: user.uid,
        completedFor: contactId,
        photoURL: payload.photoURL
      },
      { merge: true }
    );


  return db
    .collection('users')
    .doc(user.uid)
    .collection('contacts')
    .doc(contactId)
    .set(
      {
        name: payload.name,
        summary: payload.summary,
        uid: contactId,
        lastContacted: null,
        photoURL: payload.photoURL,
        activeTaskCount: 1,
      },
      { merge: true }
    );
});



