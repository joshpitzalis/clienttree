import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

admin.initializeApp()

const db = admin.firestore()

const API_KEY = functions.config().sendgrid && functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);



// email template id d-c24a91fd567f4cd0ac659ee80fd9e173
// 4 days after sign in
//    check if person has imported yet
//       if they have send then 5 short list
//       if they ahven;t send them email saying they can google import
// get all archived users
//   send one with ebest photos
// send three times and then thats it.

// every 4 days
export const contactImportReminder = functions.pubsub
  .schedule('0 */12 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async context => {

    // all people that have contacts > 0 but active less than 50 && send count <3
    const peopleToRemind = await db
      .collection('users')
      .where('activeCount', "<", 50)
      .where('contactsImported', "==", true)

    // get top 5 users for each person who needs reminding
    peopleToRemind.forEach((person) => {
      // get top 5 users
    })

    // send email to people with contacts
    return peopleToRemind.forEach((person
      : {
        email: string
        reminders: { person: string, reminder: string }[],
        url: string,
        count: number,
        plural: boolean
      }) => {

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

    // increment send count



    // const importRemindersSent = useSelector(
    //   store => store.user && store.user.importRemindersSent
    // );

    // const archivedContacts = useSelector(
    //   store =>
    //     store.user &&
    //     store.user.contacts &&
    //     store.user.contacts.filter(item => item.bucket === 'archived')
    // );

    // //   send one with ebest photos
    // const pickTopContacts = (_count, _contacts) => _contacts.slice(_count - 1);
    // // send three times and then thats it.
    // const sendEmail = _contacts => {};

    // const handleContacEmail = () => {
    //   console.log({ importRemindersSent });
    //   // check send count, you only send three times max and then thats it.
    //   if (importRemindersSent && importRemindersSent >= 3) {
    //     return;
    //   }

    //   if (archivedContacts && archivedContacts <= 50) {
    //     //   send one with best photos
    //     const topContacts = pickTopContacts(5, archivedContacts);
    //     // send three times and then thats it.
    //     sendEmail(topContacts);
    //   }
    // };
  })


// Send a daily summary email to all users
export const dailySummary = functions.pubsub
  .schedule('0 */12 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async context => {


    // get all upcoming reminders
    const allReminders = await db
      .collectionGroup('helpfulTasks')
      .where('dateCompleted', '==', null)
      // .where('dueDate', '>=', +new Date())
      .where('dueDate', '<=', +new Date() + 86400000)
      .get()
      .then(results => {
        const data = results.docs.map(snap => snap.data());

        const groupedData = data.reduce((result, item) => {
          // merge same emails together but accumulate their reminders
          const index = result.findIndex(
            (element: { email: string }) => element.email === item.userEmail
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

        return groupedData
      });


    // try catch?


    // for each email send the following message
    return allReminders.forEach((person
      : {
        email: string
        reminders: { person: string, reminder: string }[],
        url: string,
        count: number,
        plural: boolean
      }) => {

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


  });
