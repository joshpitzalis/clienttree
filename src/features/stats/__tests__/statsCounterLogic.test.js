import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { handleActivityCompleted } from '../statsHelpers';
import { Modal } from '../../network/components/ContactModal';
import { render } from '../../../utils/testSetup';
import { NetworkProvider } from '../../network/NetworkContext';
import {
  incrementStats,
  handleTracking,
  getStage,
} from '../../network/networkAPI';
import { markActivityComplete } from '../../network/networkEpics';
import { ACTIVITY_COMPLETED } from '../../network/networkConstants';

afterEach(cleanup);

describe('stats counter logic', () => {
  const fakeData = {
    userId: '123',
    selectedUserUid: '456',
    onClose: jest.fn(),
    incrementStats: jest.fn(),
  };

  describe('incrementing numbers', () => {
    test('when added to first column increment project stats', () => {
      const { getByTestId } = render(
        <NetworkProvider uid={fakeData.userId}>
          <Modal
            uid={fakeData.userId}
            selectedUserUid={fakeData.selectedUserUid}
            onClose={fakeData.onClose}
            incrementStats={fakeData.incrementStats}
          />
        </NetworkProvider>
      );

      expect(getByTestId('leadToggle')).toBeInTheDocument();
      userEvent.click(getByTestId('leadToggle'));
      expect(fakeData.incrementStats).toHaveBeenCalled();
    });
    test('handleTracking increments stats', async () => {
      const fakeProps = {
        checked: false,
        userId: '123',
        contactId: '345',
        name: 'name',
        photoURL: '123',
        _updateSelectedUser: jest.fn().mockResolvedValue(),
        _updateDashboardState: jest.fn().mockResolvedValue(),
        track: jest.fn(),
        _incrementStats: jest.fn(),
        _decrementStats: jest.fn(),
        _getCurrentCRMStage: jest.fn().mockResolvedValue(false),
      };

      // if checked then stats are incremenetd and event is tracked in analytics
      await handleTracking(
        true,
        fakeProps.userId,
        fakeProps.contactId,
        fakeProps.name,
        fakeProps.photoURL,
        fakeProps._updateSelectedUser,
        fakeProps._updateDashboardState,
        fakeProps.track,
        fakeProps._incrementStats,
        fakeProps._decrementStats,
        fakeProps._getCurrentCRMStage
      );

      expect(fakeProps._incrementStats).toHaveBeenCalled();
      expect(fakeProps.track).toHaveBeenCalled();
      expect(fakeProps._decrementStats).not.toHaveBeenCalled();
    });
    test('incrementStats function increments project stats', async () => {
      const fakeProps = {
        userId: fakeData.userId,
        _getCompletedActivityCount: jest.fn().mockResolvedValue(39),
        _getLeadsContacted: jest.fn().mockResolvedValue(5),
        _setStats: jest.fn(),
        _toast: jest.fn(),
      };
      await incrementStats(
        fakeProps.userId,
        fakeProps._getCompletedActivityCount,
        fakeProps._getLeadsContacted,
        fakeProps._setStats,
        fakeProps._toast
      );
      expect(fakeProps._getCompletedActivityCount).toHaveBeenCalledTimes(1);
      expect(fakeProps._getLeadsContacted).toHaveBeenCalledTimes(1);
      expect(fakeProps._setStats).toHaveBeenCalledTimes(1);
      expect(fakeProps._setStats).toHaveBeenCalledWith(fakeProps.userId, 6, 39);
      expect(fakeProps._toast).not.toHaveBeenCalled();
    });
    test('if removing from dashboard and not on CRM stage 1 then do not decrement lead value', async () => {
      const fakeProps = {
        checked: false,
        userId: '123',
        contactId: '345',
        name: 'name',
        photoURL: '123',
        _updateSelectedUser: jest.fn().mockResolvedValue(),
        _updateDashboardState: jest.fn().mockResolvedValue(),
        track: jest.fn(),
        _incrementStats: jest.fn(),
        _decrementStats: jest.fn(),
        _getCurrentCRMStage: jest.fn().mockResolvedValue(false),
      };

      await handleTracking(
        fakeProps.checked,
        fakeProps.userId,
        fakeProps.contactId,
        fakeProps.name,
        fakeProps.photoURL,
        fakeProps._updateSelectedUser,
        fakeProps._updateDashboardState,
        fakeProps.track,
        fakeProps._incrementStats,
        fakeProps._decrementStats,
        fakeProps._getCurrentCRMStage
      );
      // if not checked then no increment  and event is not tracked
      expect(fakeProps._incrementStats).not.toHaveBeenCalled();
      expect(fakeProps.track).not.toHaveBeenCalled();
      expect(fakeProps._decrementStats).not.toHaveBeenCalled();
    });
    test('if removing from first column then decrement lead value', async () => {
      const fakeProps = {
        checked: false,
        userId: '123',
        contactId: '345',
        name: 'name',
        photoURL: '123',
        _updateSelectedUser: jest.fn().mockResolvedValue(),
        _updateDashboardState: jest.fn().mockResolvedValue(),
        track: jest.fn(),
        _incrementStats: jest.fn(),
        _decrementStats: jest.fn(),
        _getCurrentCRMStage: jest.fn().mockResolvedValue('first'),
      };

      await handleTracking(
        fakeProps.checked,
        fakeProps.userId,
        fakeProps.contactId,
        fakeProps.name,
        fakeProps.photoURL,
        fakeProps._updateSelectedUser,
        fakeProps._updateDashboardState,
        fakeProps.track,
        fakeProps._incrementStats,
        fakeProps._decrementStats,
        fakeProps._getCurrentCRMStage
      );
      // if not checked then no increment  and event is not tracked
      expect(fakeProps._incrementStats).not.toHaveBeenCalled();
      expect(fakeProps.track).not.toHaveBeenCalled();
      expect(fakeProps._decrementStats).toHaveBeenCalled();
      expect(fakeProps._getCurrentCRMStage).toHaveBeenCalled();
    });

    test('getState tells you if a contact is in first stage of dashboard', () => {
      const fakeProps = {
        contactId: '345',
        dashboard: {
          stages: {
            stage1: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: ['345'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
          },
        },
      };
      expect(getStage(fakeProps.dashboard, fakeProps.contactId)).toEqual(
        'first'
      );
    });
    test('getState tells you if a contact is in last stage of dashboard', () => {
      const fakeProps = {
        contactId: '345',
        dashboard: {
          stages: {
            stage1: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
            stage2: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
            stage3: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: ['345'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
          },
        },
      };
      expect(getStage(fakeProps.dashboard, fakeProps.contactId)).toEqual(
        'last'
      );
    });
    test('getState tells you if a contact is not on the dashboard', () => {
      const fakeProps = {
        contactId: '345',
        dashboard: {
          stages: {
            stage1: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
            stage2: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
            stage3: {
              challenges: [
                {
                  id: 1571641758561,
                  link: '',
                  title: 'How to follow up with a lead',
                },
              ],
              id: 'stage1',
              people: [''],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Leads',
            },
          },
        },
      };
      expect(getStage(fakeProps.dashboard, fakeProps.contactId)).toBeFalsy();
    });

    test('if removed from last column lead stats increases', async () => {
      const fakeProps = {
        checked: false,
        userId: '123',
        contactId: '345',
        name: 'name',
        photoURL: '123',
        _updateSelectedUser: jest.fn().mockResolvedValue(),
        _updateDashboardState: jest.fn().mockResolvedValue(),
        track: jest.fn(),
        _incrementStats: jest.fn(),
        _decrementStats: jest.fn(),
        _getCurrentCRMStage: jest.fn().mockResolvedValue('last'),
        _incrementProjectStats: jest.fn(),
      };

      await handleTracking(
        fakeProps.checked,
        fakeProps.userId,
        fakeProps.contactId,
        fakeProps.name,
        fakeProps.photoURL,
        fakeProps._updateSelectedUser,
        fakeProps._updateDashboardState,
        fakeProps.track,
        fakeProps._incrementStats,
        fakeProps._decrementStats,
        fakeProps._getCurrentCRMStage,
        fakeProps._incrementProjectStats
      );
      // if not checked then no increment and event is not tracked
      expect(fakeProps._incrementStats).not.toHaveBeenCalled();
      expect(fakeProps.track).not.toHaveBeenCalled();
      expect(fakeProps._decrementStats).not.toHaveBeenCalled();
      expect(fakeProps._incrementProjectStats).toHaveBeenCalled();
    });

    test('whenever a task is completed  it increments activity stats', async () => {
      const fakeProps = {
        payload: {
          taskId: '123',
          myUid: '345',
          completedFor: '678',
          setSelectedUser: jest.fn(),
          setVisibility: jest.fn(),
          checked: true,
        },
        inCompleteTask: jest.fn(),
        decrementActivityStats: jest.fn(),
        handleCompleteTask: jest.fn(),
        incrementActivityStats: jest.fn(),
        track: jest.fn(),
        getActivitiesLeft: jest.fn().mockResolvedValue(),
      };

      await handleActivityCompleted(
        fakeProps.payload,
        fakeProps.inCompleteTask,
        fakeProps.decrementActivityStats,
        fakeProps.handleCompleteTask,
        fakeProps.incrementActivityStats,
        fakeProps.track,
        fakeProps.getActivitiesLeft
      );

      expect(fakeProps.decrementActivityStats).toHaveBeenCalledTimes(1);
      expect(fakeProps.decrementActivityStats).toHaveBeenCalledWith('345');
      expect(fakeProps.incrementActivityStats).not.toHaveBeenCalled();
    });

    test('whenever  a task is uncompleted  it should update stats box', async () => {
      const fakeProps = {
        payload: {
          taskId: '123',
          myUid: '345',
          completedFor: '678',
          setSelectedUser: jest.fn(),
          setVisibility: jest.fn(),
          checked: false,
        },
        inCompleteTask: jest.fn(),
        decrementActivityStats: jest.fn(),
        handleCompleteTask: jest.fn(),
        incrementActivityStats: jest.fn(),
        track: jest.fn(),
        getActivitiesLeft: jest.fn().mockResolvedValue(),
      };

      await handleActivityCompleted(
        fakeProps.payload,
        fakeProps.inCompleteTask,
        fakeProps.decrementActivityStats,
        fakeProps.handleCompleteTask,
        fakeProps.incrementActivityStats,
        fakeProps.track,
        fakeProps.getActivitiesLeft
      );

      expect(fakeProps.incrementActivityStats).toHaveBeenCalledTimes(1);
      expect(fakeProps.incrementActivityStats).toHaveBeenCalledWith('345');
      expect(fakeProps.decrementActivityStats).not.toHaveBeenCalled();
    });

    // test.only('markActivityComplete epic produces correct actions', () => {
    //   const testScheduler = new TestScheduler((actual, expected) => {
    //     expect(actual).toEqual(expected);
    //   });

    //   testScheduler.run(({ hot, cold, expectObservable }) => {
    //     const action$ = hot('a', {
    //       a: {
    //         type: ACTIVITY_COMPLETED,
    //         payload: { checked: true },
    //       },
    //     });
    //     const state$ = null;

    //     const dependencies = {
    //       decrementActivityStats: jest.fn(),
    //     };
    //     const output$ = markActivityComplete(action$, state$, dependencies);

    //     expectObservable(output$).toBe('a', {
    //       a: { type: 'done' },
    //     });

    //     // output$.toArray().subscribe(() => {
    //     //   expect(dependencies.decrementActivityStats).toHaveBeenCalled();
    //     // });
    //   });
    // });

    test('should start off as a minimum of 3:1 and 10:1', () => {});

    describe.skip('to-do', () => {
      test('when columns are rearranged, leads are added to first column', () => {});
      test('when columns are rearranged, projects are incremented of removed from last column', () => {});
      test('support text under add someone to your network should say, on hover, to begin with just add 5 people that you have  been meaning to touch base with for a while now.', () => {});
      test('change emoji to icons', () => {});

      test('test adding to a new network works, on a virgin account', () => {});

      test('be able to remove josh form a virgin account', () => {});
      test('only reveal stats  on hover', () => {});
      test('loading indicators for people page', () => {});
    });
  });
});
