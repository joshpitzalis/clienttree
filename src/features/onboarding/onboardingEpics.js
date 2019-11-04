import { tap, mapTo, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { toast$ } from '../notifications/toast';
import { ONBOARDING_STEP_COMPLETED } from './onboardingConstants';
import firebase from '../../utils/firebase';

export const onboardingEpic = action$ =>
  action$.pipe(
    ofType(ONBOARDING_STEP_COMPLETED),
    tap(async ({ payload }) => {
      const { userId, onboardingStep, checked } = payload;
      if (checked) {
        await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .set({ onboarding: { [onboardingStep]: false } }, { merge: true });
      } else {
        await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .set({ onboarding: { [onboardingStep]: true } }, { merge: true });
      }
      const { analytics } = window;
      analytics.track(onboardingStep);
    }),
    catchError(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    ),
    mapTo({ type: 'onboardingStepUpdated' })
  );
