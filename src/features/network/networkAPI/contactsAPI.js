import firebase from '../../../utils/firebase';
import { helpfulTaskRef, setTaskDetails, newDocRef } from './APIcalls';
import { toast$ } from '../../notifications/toast';

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

  const newDoc = newDocRef(userId);
  const contactUid = contactId || uid || newDoc.id;

  const task = helpfulTaskRef(userId, contactUid);
  const taskId = task.id;

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

  return [
    {
      ...basePayload,
      name,
      summary,
      lastContacted,
    },
    {
      ...basePayload,
      taskId,
    },
    contactUid,
  ];
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

const updateSelectedUser = (_userId, _contactId, tracked) =>
  firebase
    .firestore()
    .collection('users')
    .doc(_userId)
    .collection('contacts')
    .doc(_contactId)
    .set(
      {
        tracked,
      },
      { merge: true }
    );

const updateDashboardState = async (
  _userId,
  tracked,
  _contactId,
  _name,
  _photoURL
) => {
  const dashboardState = await firebase
    .firestore()
    .collection('users')
    .doc(_userId)
    .get()
    .then(data => data.data() && data.data().dashboard);

  const newState = { ...dashboardState };

  if (tracked) {
    newState.people = {
      ...newState.people,
      [_contactId]: {
        id: _contactId,
        name: _name,
        photoURL: _photoURL,
      },
    };

    const firstStage = newState.stageOrder[0];

    newState.stages[firstStage].people = [
      ...newState.stages[firstStage].people,
      _contactId,
    ];
  }

  if (!tracked) {
    delete newState.people[_contactId];

    newState.stages = Object.entries(newState.stages).reduce(
      (a, [k, stage]) => ({
        ...a,
        [k]: {
          ...stage,
          people:
            stage.people && stage.people.length
              ? stage.people.filter(person => person !== _contactId)
              : [],
        },
      }),
      {}
    );
  }

  return firebase
    .firestore()
    .collection('users')
    .doc(_userId)
    .set(
      {
        dashboard: newState,
      },
      { merge: true }
    );
};

const getCompletedActivityCount = userId =>
  firebase
    .firestore()
    .collectionGroup('helpfulTasks')
    .where('connectedTo', '==', userId)
    .where('dateCompleted', '>', new Date(0))
    .get()
    .then(collection => {
      const data = collection.docs.map(doc => doc.data());
      return data.length;
    });

const getLeadsContacted = userId =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(
      doc =>
        doc.exists &&
        doc.data() &&
        doc.data().stats &&
        doc.data().stats.leadsContacted
    );

const setStats = (userId, newLeadCount, activitiesCompleted) => {
  const calculateLeadRatio = (_newLeadCount, _activitiesCompleted) =>
    Math.ceil(_activitiesCompleted / _newLeadCount);

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        stats: {
          leadsContacted: newLeadCount,
          leadRatio: calculateLeadRatio(newLeadCount, activitiesCompleted),
        },
      },
      { merge: true }
    );
};

const getProjectsCompleted = userId =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(
      doc =>
        doc.exists &&
        doc.data() &&
        doc.data().stats &&
        doc.data().stats.projectsCompleted
    );
const setProjectStats = (userId, newLeadCount, newProjectCount) => {
  const calculateRatio = (_newLeadCount, _newProjectCount) =>
    Math.ceil(_newLeadCount / _newProjectCount);

  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .set(
      {
        stats: {
          projectsCompleted: newProjectCount,
          projectRatio: calculateRatio(newLeadCount, newProjectCount),
        },
      },
      { merge: true }
    );
};

export const incrementProjectStats = async (
  userId,
  _getProjectsCompleted = getProjectsCompleted,
  _getLeadsContacted = getLeadsContacted,
  _setProjectStats = setProjectStats,
  _toast = toast$
) =>
  Promise.all(
    // get activities completed and current stats data
    [_getLeadsContacted(userId), _getProjectsCompleted(userId)]
  )
    .then(([totalLeads, totalProjects]) => {
      if (totalProjects && totalLeads) {
        const newProjectCount = totalProjects + 1;
        // increment leads acquired and update ratio
        _setProjectStats(userId, totalLeads, newProjectCount);
      } else {
        throw new Error({
          message:
            'Error updating the hustle meter. Much Confuse. No hustle :(',
        });
      }
    })
    .catch(error =>
      _toast.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
      })
    );

export const incrementStats = async (
  userId,
  _getCompletedActivityCount = getCompletedActivityCount,
  _getLeadsContacted = getLeadsContacted,
  _setStats = setStats,
  _toast = toast$
) =>
  Promise.all(
    // get activities completed and current stats data
    [_getLeadsContacted(userId), _getCompletedActivityCount(userId)]
  )
    .then(([totalLeads, activitiesCompleted]) => {
      if (totalLeads && activitiesCompleted) {
        const newLeadCount = totalLeads + 1;
        // increment leads acquired and update ratio
        _setStats(userId, newLeadCount, activitiesCompleted);
      } else {
        throw new Error({
          message:
            'Error updating the hustle meter. Much Confuse. No hustle :(',
        });
      }
    })
    .catch(error =>
      _toast.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
      })
    );

export const decrementStats = async (
  userId,
  _getCompletedActivityCount = getCompletedActivityCount,
  _getLeadsContacted = getLeadsContacted,
  _setStats = setStats,
  _toast = toast$
) =>
  Promise.all(
    // get activities completed and current stats data
    [_getLeadsContacted(userId), _getCompletedActivityCount(userId)]
  )
    .then(([totalLeads, activitiesCompleted]) => {
      if (totalLeads && activitiesCompleted) {
        const newLeadCount = totalLeads - 1;
        console.log({ newLeadCount });

        // decrement leads acquired and update ratio
        _setStats(userId, newLeadCount, activitiesCompleted);
      } else {
        throw new Error({
          message:
            'Error updating the hustle meter. Much Confuse. No hustle :(',
        });
      }
    })
    .catch(error =>
      _toast.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
      })
    );

export const getStage = (dashboard, contactId) => {
  const firstStage = dashboard.stageOrder && dashboard.stageOrder[0];

  const inFirstStage =
    firstStage && dashboard.stages[firstStage].people.includes(contactId);

  if (inFirstStage) {
    return 'first';
  }

  const lastStage =
    dashboard.stageOrder &&
    dashboard.stageOrder[dashboard.stageOrder.length - 1];

  const inLastStage =
    lastStage && dashboard.stages[lastStage].people.includes(contactId);

  if (inLastStage) {
    return 'last';
  }

  return false;
};

export const getCurrentCRMStage = (contactId, userId) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(doc => {
      const dashboard = doc.exists && doc.data() && doc.data().dashboard;
      return getStage(dashboard, contactId);
    });

export const handleTracking = async (
  checked,
  userId,
  contactId,
  name,
  photoURL,
  _updateSelectedUser = updateSelectedUser,
  _updateDashboardState = updateDashboardState,
  track = window && window.analytics && window.analytics.track,
  _incrementStats = incrementStats,
  _decrementStats = decrementStats,
  _getCurrentCRMStage = getCurrentCRMStage,
  _incrementProjectStats = incrementProjectStats
) => {
  // find out what stage of the CRM this contact is in
  const stage = await _getCurrentCRMStage(contactId, userId);

  return Promise.all([
    _updateDashboardState(userId, checked, contactId, name, photoURL),
    _updateSelectedUser(userId, contactId, checked),
  ])
    .then(async () => {
      if (checked) {
        _incrementStats(userId);
        // track event in amplitude
        track('CRM Updated', {
          movedTo: 'Leads',
        });
        return;
      }

      if (stage === 'first') {
        _decrementStats(userId);
        return;
      }

      if (stage === 'last') {
        _incrementProjectStats(userId);
      }
    })
    .catch(error =>
      toast$.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
      })
    );
};
