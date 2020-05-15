'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const functions = require('firebase-functions')
const admin = require('firebase-admin')
// Sendgrid Config
const sgMail = require('@sendgrid/mail')
admin.initializeApp()
const db = admin.firestore()
const API_KEY = functions.config().sendgrid && functions.config().sendgrid.key
const TEMPLATE_ID = functions.config().sendgrid.template
sgMail.setApiKey(API_KEY)
// Send a daily summary email to all users
exports.dailySummary = functions.pubsub
  .schedule('0 */12 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    // get all upcoming reminders
    const allReminders = await db
      .collectionGroup('helpfulTasks')
      .where('dateCompleted', '==', null)
    // .where('dueDate', '>=', +new Date())
      .where('dueDate', '<=', +new Date() + 86400000)
      .get()
      .then(results => {
        const data = results.docs.map(snap => snap.data())
        const groupedData = data.reduce((result, item) => {
          // merge same emails together but accumulate their reminders
          const index = result.findIndex((element) => element.email === item.userEmail)
          if (index >= 0) {
            // add to that item
            result[index] = Object.assign(Object.assign({}, result[index]), {
              reminders: [
                ...result[index].reminders,
                {
                  person: item.contactName,
                  reminder: item.name
                }
              ],
              count: result[index].count + 1,
              plural: 's'
            })
            return result
          }
          result.push({
            email: item.userEmail,
            reminders: [
              {
                person: item.contactName,
                reminder: item.name
              }
            ],
            url: `/user/${item.connectedTo}/network`,
            count: 1,
            plural: ''
          })
          return result
        }, [])
        return groupedData
      })
    // try catch?
    // for each email send the following message
    return allReminders && allReminders.forEach((person) => {
      const msg = {
        to: person.email,
        from: 'reminders@clienttree.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
          reminders: person.reminders,
          url: person.url,
          count: person.count,
          plural: person.plural
        }
      }
      return sgMail.send(msg)
    })
  })
// # sourceMappingURL=reminders.js.map
