import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createEpicMiddleware, combineEpics } from 'redux-observable'
import { catchError } from 'rxjs/operators'
import { taskSlice } from '../features/people/taskSlice'
import peopleSlice from '../features/people/peopleSlice'
import {
  updateStatsDetails,
  projectCompleted,
  leadContacted
} from '../features/stats/statsEpic'
import {
  markActivityComplete,
  setNewUserTask,
  updateContactEpic
} from '../features/people/networkEpics'
import {
  userSlice,
  fetchUserDataEpic,
  contactsSlice
} from '../pages/Dashboard'
import { onboardingEpic } from '../features/onboarding/onboardingEpics'

import {
  stageTitleUpdate,
  newStageCreated,
  stageDestroyed
} from '../features/projects/projectEpics'
import { toast$ } from '../features/notifications/toast'
import {
  decrementActivityStats,
  incrementActivityStats
} from '../features/stats/statsAPI'
import { updateUserProfile } from '../features/projects/dashAPI'
import { setContact } from '../features/people/peopleAPI'

export const rootEpic = (action$, store$, _dependencies) =>
  combineEpics(
    markActivityComplete,
    setNewUserTask,
    updateStatsDetails,
    updateContactEpic,
    projectCompleted,
    leadContacted,
    stageTitleUpdate,
    newStageCreated,
    stageDestroyed,
    fetchUserDataEpic,
    onboardingEpic
  )(action$, store$, _dependencies).pipe(
    catchError((error, source) => {
      toast$.next({ type: 'ERROR', message: error.message || error })
      return source
    })
  )

export const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
  user: userSlice.reducer,
  contacts: contactsSlice.reducer,
  people: peopleSlice.reducer
})

export const dependencies = {
  decrementActivityStats,
  incrementActivityStats,
  track: window && window.analytics && window.analytics.track,
  updateUserProfile,
  setContact
}

export const epicMiddleware = createEpicMiddleware({
  dependencies
})

export const middleware =
  process.env.NODE_ENV !== 'production'
    ? [
      // eslint-disable-next-line global-require
      require('redux-immutable-state-invariant').default(),
      ...getDefaultMiddleware(),
      epicMiddleware
    ]
    : [...getDefaultMiddleware(), epicMiddleware]

const store = configureStore({
  reducer: rootReducer,
  middleware
})

epicMiddleware.run(rootEpic)

export default store
