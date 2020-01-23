import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp()

const db = admin.firestore()

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);


// Send a daily summary email to all users 
export const dailySummary = functions.pubsub.schedule('every 24 hours').onRun(async context => {
  // get email of users who have reminders for today
  const userSnapshots = await admin.firestore().collection('users').get();
  const emails = userSnapshots.docs.map(snap => snap.data().email);

  // add due dates to reminders

  // get all reminders
  // where die date is today 
  // // figure out how to establish today/24 hour window
  // where not completedyet
  // get user email for each reminder
  // get contact name for each reminder

  // group by email


  [{
    email:,
    reminders: [
      {
        person: ''
        reminder: ''

      }
    ],
    url: ``,
    count: 1,
    plural: true,
  }]

  // for each email send the following message
  const msg = {
    to: emails,
    from: 'reminders@clienttree.io',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      reminders: [],
      url: `Your Weekly Summary`,
      count: 'Insert summary here...',
      plural: true
    },
  };

  // for each email send 
  return sgMail.send(msg);
});

// export const someoneSignedUp = functions.auth.user().onCreate(async (user) => {
//   const payload = {
//     photoURL:
//       'https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg',
//     taskName: 'Send Josh a blank email with your new signature',
//     userId: user.uid,
//     name: 'Josh',
//     summary: 'Built Client Tree. Specialises in building educational web apps.',
//   };

//   const newDoc = db
//     .collection('users')
//     .doc(user.uid)
//     .collection('contacts')
//     .doc();

//   const contactId = newDoc.id

//   const task = db
//     .collection('users')
//     .doc(user.uid)
//     .collection('contacts')
//     .doc(contactId)
//     .collection('helpfulTasks')
//     .doc();

//   const taskId = task.id;


//   await db.collection('users')
//     .doc(user.uid)
//     .collection('contacts')
//     .doc(contactId)
//     .collection('helpfulTasks')
//     .doc(taskId)
//     .set(
//       {
//         taskId,
//         name: payload.taskName,
//         dateCreated: new Date(),
//         dateCompleted: null,
//         connectedTo: user.uid,
//         completedFor: contactId,
//         photoURL: payload.photoURL
//       },
//       { merge: true }
//     );


//   return db
//     .collection('users')
//     .doc(user.uid)
//     .collection('contacts')
//     .doc(contactId)
//     .set(
//       {
//         name: payload.name,
//         summary: payload.summary,
//         uid: contactId,
//         lastContacted: null,
//         photoURL: payload.photoURL,
//         activeTaskCount: 1,
//       },
//       { merge: true }
//     );
// });



