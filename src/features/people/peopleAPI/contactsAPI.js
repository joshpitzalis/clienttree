import { compose } from 'redux';
import firebase from '../../../utils/firebase';
import { helpfulTaskRef, setTaskDetails, newDocRef } from './APIcalls';
import { toast$ } from '../../notifications/toast';
import { initialData } from '../../projects/initialData';

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
    )
    .catch(error =>
      toast$.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/updateSelectedUser',
      })
    );

const updateDashboardState = async (
  _userId,
  tracked,
  _contactId,
  _name,
  _photoURL
) => {
  try {
    const dashboardState = await firebase
      .firestore()
      .collection('users')
      .doc(_userId)
      .get()
      .then(data => data.data() && data.data().dashboard);

    const newState = { ...initialData, ...dashboardState };

    if (tracked) {
      newState.people = {
        ...newState.people,
        [_contactId]: {
          id: _contactId,
          name: _name,
          photoURL: _photoURL,
        },
      };

      const firstStage = newState.stageOrder && newState.stageOrder[0];
      if (firstStage) {
        newState.stages[firstStage].people = [
          ...newState.stages[firstStage].people,
          _contactId,
        ];
      }
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
  } catch (error) {
    return toast$.next({
      type: 'ERROR',
      message: error && error.message ? error.message : error,
      from: 'contactsAPI/updateDashboardState',
    });
  }
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
    })
    .catch(error =>
      toast$.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/getCompletedActivityCount',
      })
    );

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
    )
    .catch(error =>
      toast$.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/getLeadsContacted',
      })
    );

const setStats = (userId, newLeadCount, activitiesCompleted) => {
  const calculateLeadRatio = (_newLeadCount, _activitiesCompleted) =>
    Math.ceil(_activitiesCompleted / _newLeadCount);
  try {
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
  } catch (error) {
    return toast$.next({
      type: 'ERROR',
      message: error && error.message ? error.message : error,
      from: 'contactsAPI/setStats',
    });
  }
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
    )
    .catch(error =>
      toast$.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/getProjectsCompleted',
      })
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

export const incrementProjectStats = (
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
    .then(([totalLeads = 0, totalProjects = 0]) => {
      const newProjectCount = totalProjects + 1;
      // increment leads acquired and update ratio
      _setProjectStats(userId, totalLeads, newProjectCount);
    })
    .catch(error =>
      _toast.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/incrementProjectStats',
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
    .then(async ([totalLeads = 0, activitiesCompleted = 0]) => {
      const newLeadCount = totalLeads + 1;
      // increment leads acquired and update ratio
      await _setStats(userId, newLeadCount, activitiesCompleted);
    })
    .catch(error => {
      _toast.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/incrementStats',
      });
    });

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
    .then(([totalLeads = 0, activitiesCompleted = 0]) => {
      const newLeadCount = totalLeads - 1;
      // decrement leads acquired and update ratio
      _setStats(userId, newLeadCount, activitiesCompleted);
    })
    .catch(error =>
      _toast.next({
        type: 'ERROR',
        message: error && error.message ? error.message : error,
        from: 'contactsAPI/decrementStats',
      })
    );

export const getStage = (dashboard, contactId) => {
  const firstStage =
    dashboard && dashboard.stageOrder && dashboard.stageOrder[0];

  const inFirstStage =
    firstStage && dashboard.stages[firstStage].people.includes(contactId);

  if (inFirstStage) {
    return 'first';
  }

  const lastStage =
    dashboard &&
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
  try {
    // find out what stage of the CRM this contact is in
    const stage = await _getCurrentCRMStage(contactId, userId);

    await Promise.all([
      _updateDashboardState(userId, checked, contactId, name, photoURL),
      _updateSelectedUser(userId, contactId, checked),
    ]);

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
  } catch (error) {
    return toast$.next({
      type: 'ERROR',
      message: error && error.message ? error.message : error,
      from: 'contactsAPI/handleTracking',
    });
  }
};

export const updateLastContacted = (userId, uid) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid)
    .set(
      {
        lastContacted: +new Date(),
      },
      { merge: true }
    );

export const setContact = ({
  userId,
  uid,
  name,
  summary = '',
  lastContacted = null,
  photoURL = '',
  downloadURL = '',
  notes = {},
  email,
}) =>
  firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('contacts')
    .doc(uid)
    .set({
      name,
      summary,
      uid,
      lastContacted,
      photoURL: downloadURL || photoURL,
      activeTaskCount: 1,
      notes,
      email,
    });

export const setProfileImage = ({ imageFile, contactId }) =>
  firebase
    .storage()
    .ref(`contacts/${contactId}.png`)
    .put(imageFile)
    .then(({ ref }) => ref.getDownloadURL());
