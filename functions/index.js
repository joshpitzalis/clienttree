const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

const db = admin.firestore();

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
const TEMPLATE_ID_CONTACTS = functions.config().sendgrid.template2;

sgMail.setApiKey(API_KEY);

// email template id
// 4 days after sign in
//    check if person has imported yet
//       if they have send then 5 short list
//       if they ahven;t send them email saying they can google import
// get all archived users
//   send one with ebest photos
// send three times and then thats it.

// every 4 days
// exports.contactImportReminder = functions.https.onCall(() =>
exports.contactImportReminder = functions.pubsub
  .schedule('0 0 */3 * *')
  .timeZone('Asia/Kolkata')
  .onRun(() =>
    // all people that have contacts > 0 but active less than 50 && send count <3
    db
      .collection('users')
      .where('archivedContacts', '>', 1)
      .where('archivedContacts', '<', 50)
      .where('contactsImported', '==', true)
      .get()
      .then(results =>
        results.docs.map(snap => {
          const { activeContacts, archivedContacts, userId } = snap.data();
          return { activeContacts, archivedContacts, userId };
        })
      )
      .then(results => {
        // get top 5 users for each person who needs reminding

        const topFives = results.map(
          ({ userId, activeContacts, archivedContacts }) =>
            db
              .collection('users')
              .doc(userId)
              .collection('contacts')
              .where('bucket', '==', 'archived')
              .where('defaultImage', '==', false)
              .limit(5)
              .get()
              .then(_results => {
                const contacts = _results.docs.map(snap => snap.data());
                return {
                  userId,
                  contacts,
                  activeContacts,
                  archivedContacts,
                };
              })
        );

        return Promise.all(topFives);
      })
      .then(results => {
        const withEmails = results.map(
          ({ userId, contacts, activeContacts, archivedContacts }) =>
            admin
              .auth()
              .getUser(userId)
              .then(({ email }) => ({
                email,
                contacts,
                activeContacts,
                archivedContacts,
                userId,
              }))
        );

        return Promise.all(withEmails);
      })
      .then(results =>
        // console.log({ results })

        // send email to people with contacts
        results.forEach(
          ({ email, contacts, activeContacts, archivedContacts, userId }) => {
            const msg = {
              to: email,
              from: 'reminders@clienttree.io',
              templateId: TEMPLATE_ID_CONTACTS,
              dynamic_template_data: {
                contacts,
                url: `/user/${userId}/network`,
                activeContacts,
                archivedContacts,
              },
            };

            return sgMail.send(msg);
          }
        )
      )
  );

// Send a daily summary email to all users
exports.dailySummary = functions.pubsub
  .schedule('0 */12 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(() =>
    db
      .collectionGroup('helpfulTasks')
      .where('dateCompleted', '==', null)
      // .where('dueDate', '>=', +new Date())
      .where('dueDate', '<=', Number(new Date()) + 86400000)
      .get()
      .then(results => {
        const data = results.docs.map(snap => snap.data());

        const groupedData = data.reduce((result, item) => {
          // merge same emails together but accumulate their reminders
          const index = result.findIndex(
            element => element.email === item.userEmail
          );
          if (index >= 0) {
            // add to that item
            result[index] = {
              ...result[index],
              reminders: [
                ...result[index].reminders,
                {
                  person: item.contactName,
                  reminder: item.name,
                },
              ],
              count: result[index].count + 1,
              plural: 's',
            };
            return result;
          }
          result.push({
            email: item.userEmail,
            reminders: [
              {
                person: item.contactName,
                reminder: item.name,
              },
            ],
            url: `/user/${item.connectedTo}/network`,
            count: 1,
            plural: '',
          });
          return result;
        }, []);

        return groupedData;
      })
      .then(allReminders =>
        // for each email send the following message
        allReminders.forEach(person => {
          const msg = {
            to: person.email,
            from: 'reminders@clienttree.io',
            templateId: TEMPLATE_ID,
            dynamic_template_data: {
              reminders: person.reminders,
              url: person.url,
              count: person.count,
              plural: person.plural,
            },
          };
          return sgMail.send(msg);
        })
      )
  );

// try catch?
