import { tap, mapTo, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { toast$ } from '../notifications/toast';
import { ONBOARDING_STEP_COMPLETED } from './onboardingConstants';
import firebase from '../../utils/firebase';

export const onboardingEpic = action$ =>
  action$.pipe(
    ofType(ONBOARDING_STEP_COMPLETED),
    tap(async ({ payload }) => {
      const { analytics } = window;
      const { userId, onboardingStep, checked } = payload;
      if (checked) {
        await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .set({ onboarding: { [onboardingStep]: false } }, { merge: true });
        // this is to track user progress in customer io
        // true means the emails still needs to be sent
        analytics.identify(userId, {
          [onboardingStep]: true,
        });
      } else {
        await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .set({ onboarding: { [onboardingStep]: true } }, { merge: true });

        // this is to track user progress in customer io
        // false means the emails has been sent, and therefore no longer needs to be sent
        analytics.identify(userId, {
          [onboardingStep]: false,
        });
      }
      //  this is to track product retention in amplitude
      analytics.track(onboardingStep);
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'onboardingStepUpdated' })
  );
