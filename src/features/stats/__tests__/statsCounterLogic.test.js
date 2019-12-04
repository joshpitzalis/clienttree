import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../../network/components/ContactModal';
import { render } from '../../../utils/testSetup';
import { NetworkProvider } from '../../network/NetworkContext';
import {
  incrementStats,
  handleTracking,
  getStage,
} from '../../network/networkAPI';

// jest.mock('../../network/networkAPI');

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

    test('whenever  a task is completed  it should update stats  box', () =>
      false);
    // also check for real time updats of stats when toggling tracking button in modal

    describe.skip('to-do', () => {
      test('should start off as a minimum of 3:1 and 10:1', () => {});

      test('when columns are rearranged, leads are added to new column', () => {});
      test('when columns are rearranged, projects are incremented of removed from last column', () => {});

      test('if removed from last column revert lead stats', () => {});
      test('if task uncompleted rever activity stats', () => {});
      test('whenever  a task is uncompleted  it shoudl update stats  box', () => {});

      test('one a person incremenst the stats they should not be able to increment agan', () => {
        // for example at the moment they could drop at the bginning and then drop onto 7 and it would increment again
      });
    });
  });
});
