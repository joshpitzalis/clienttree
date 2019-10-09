import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';
import 'firebase/storage';
import { toast$ } from '../features/notifications/toast.jsx';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(config);

const perf = firebase.performance();

firebase
  .firestore()
  .enablePersistence()
  .then(() => console.log('offline mode active'))
  .catch(function(err) {
    if (err.code === 'failed-precondition') {
      console.log('too many tabs open for offline mode to work');
      toast$.next({
        type: 'ERROR',
        message: 'too many tabs open for offline mode to work',
      });
    } else if (err.code === 'unimplemented') {
      console.log('current browser does not support offline mode');
      toast$.next({
        type: 'ERROR',
        message: 'current browser does not support offline mode',
      });
    }
  });

export default firebase;
