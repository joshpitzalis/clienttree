import { from } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';

import { ofType } from 'redux-observable';

const later = (delay, value) =>
  new Promise(resolve => setTimeout(resolve, delay, value));

export function fetchFulfilled(beers) {
  return {
    type: 'FETCH_FULFILLED',
    payload: beers,
  };
}

export const stageTitleUpdate = action$ =>
  action$.pipe(
    ofType('projects/updateTitle'),
    debounceTime(1000),
    switchMap(({ payload }) => from(later(2000, payload))),
    map(res => fetchFulfilled(res))
  );
