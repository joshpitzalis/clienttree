import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { interpret } from 'xstate';
import userEvent from '@testing-library/user-event';
import { TestScheduler } from 'rxjs/testing';
import { handleActivityCompleted } from '../statsHelpers';
import { PersonModal } from '../../people/components/PersonBox';
import { render } from '../../../utils/testSetup';
import { NetworkProvider } from '../../people/NetworkContext';
import {
  incrementStats,
  handleTracking,
  getStage,
} from '../../people/peopleAPI';
import { statsMachine } from '../StatsBox';
import { setStatDefaults } from '../statsAPI';
import { markActivityComplete } from '../../people/networkEpics';
import { ACTIVITY_COMPLETED } from '../../people/networkConstants';

jest.mock('../statsAPI');

afterEach(cleanup);

describe('stats counter logic', () => {
  const fakeData = {
    userId: '123',
    selectedUserUid: '456',
    onClose: jest.fn(),
    handleTracking: jest.fn(),
  };

  describe('incrementing numbers', () => {
    test.only('when added to first column increment project stats', () => {
      const { getByTestId } = render(
        <PersonModal
          uid={fakeData.userId}
          contactId={fakeData.selectedUserUid}
          onClose={fakeData.onClose}
          handleTracking={fakeData.handleTracking}
        />
      );

      expect(getByTestId('dashSwitch')).toBeInTheDocument();
      userEvent.click(getByTestId('dashSwitch'));
      expect(fakeData.handleTracking).toHaveBeenCalled();
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

    test('getState tells you if a contact is in first stage of dashboard', () => {
      const fakeProps = {
        contactId: 'YQeCZYL9CLRwgpaLA5RW',
        dashboard: {
          people: {
            Kq9jP1Jtof1FaudZGdJt: {
              id: 'Kq9jP1Jtof1FaudZGdJt',
              name: 'sum tooxdd',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FKq9jP1Jtof1FaudZGdJt.png?alt=media&token=648162f5-ac7d-4d3d-b8c8-ca9f5b99703a',
            },
            VQs9wjPsh4zxqPusWWvh: {
              id: 'VQs9wjPsh4zxqPusWWvh',
              name: 'Sifti',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FVQs9wjPsh4zxqPusWWvh.png?alt=media&token=1ee374cb-f13a-41b9-b984-68a702d8a38a',
            },
            YQeCZYL9CLRwgpaLA5RW: {
              id: 'YQeCZYL9CLRwgpaLA5RW',
              name: 'm',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FYQeCZYL9CLRwgpaLA5RW.png?alt=media&token=22e7a52d-8e94-4419-9a6b-1b335c0e9bbf',
            },
            dUlbJHquV2EnXjYUMkIJ: {
              id: 'dUlbJHquV2EnXjYUMkIJ',
              name: 'Sahar',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FdUlbJHquV2EnXjYUMkIJ.png?alt=media&token=d62dede3-fb6d-4ca9-a755-23b2c2741a5b',
            },
            person1: {
              id: 'person1',
              name: '🐟',
              photoURL:
                'https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg',
            },
            person2: {
              id: 'person2',
              name: '🌳',
              photoURL: 'http://tachyons.io/img/avatar_1.jpg',
            },
            person3: {
              id: 'person3',
              name: '🐟',
              photoURL: 'http://mrmrs.github.io/photos/p/3.jpg',
            },
            person4: {
              id: 'person4',
              name: '🌳',
              photoURL: 'http://mrmrs.github.io/photos/p/4.jpg',
            },
            person5: {
              id: 'person5',
              name: '🌳',
              photoURL: 'http://mrmrs.github.io/photos/p/5.jpg',
            },
            tqshoC4BCf4NnKLSt82T: {
              id: 'tqshoC4BCf4NnKLSt82T',
              name: 'Joan #dev',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FtqshoC4BCf4NnKLSt82T.png?alt=media&token=72cb00d9-72eb-4376-b616-ee1457f8f85e',
            },
          },
          stageOrder: [
            'stage4',
            'stage6',
            'stage1',
            'stage5',
            'stage2',
            'stage3',
            'stage7',
            'stage8',
          ],
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
                  id: 1571640331505,
                  link:
                    'https://docs.google.com/document/d/1Y1CY-B4DkKjjpYh0_4ENq8LAR7gFJltR/edit#',
                  title: 'Create a referral kit',
                },
              ],
              id: 'stage2',
              people: ['person3', 'person5'],

              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Contacted',
            },
            stage3: {
              challenges: [
                {
                  id: 1571640018747,
                  link: '',
                  title: 'Develop an Initial Call SOP',
                },
                {
                  id: 1571640036363,
                  link: '',
                  title:
                    'Sent a follow up email summarizing what they want and example proposal and how I work (explain your process and set expectations)',
                },
                {
                  id: 1571641088204,
                  link:
                    'https://docs.google.com/document/d/1hbj6Yrhy-mBvv3yUNxnDIx2aC4y47z_4/edit#bookmark=id.gjdgxs',
                  title: 'Project Goals Questionnaire',
                },
              ],
              id: 'stage3',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Brief Established',
            },
            stage4: {
              challenges: [
                {
                  id: 1571640054830,
                  link: '',
                  title: 'Sent contract and invoice',
                },
                {
                  id: 1571640139902,
                  link: '',
                  title:
                    'How to get paid. Upfront, half and half or milestone payments?',
                },
                {
                  id: 1571641142368,
                  link:
                    'https://docs.google.com/document/d/18f7iAMpXrvs6lSSnMhBl8brE-NwQuMrx/edit',
                  title: 'Invoicing Tools or templates ',
                },
                {
                  id: 1571641423290,
                  link:
                    'https://drive.google.com/drive/u/0/folders/187petPPv0FmTaGMRqGDu9fWx3j8uj45v',
                  title: 'Another invoice template ',
                },
              ],
              id: 'stage4',
              people: ['YQeCZYL9CLRwgpaLA5RW'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Invoice Sent',
            },
            stage5: {
              challenges: [
                {
                  id: 1571640067127,
                  link: '',
                  title:
                    ' Sent proposal (deliverables, timeline, and shared responsibilities)',
                },
                {
                  id: 1571640078995,
                  link: '',
                  title:
                    'Email confirmation of deliverables, process, timeline, and shared responsibilities before first milestone is paid',
                },
                {
                  id: 1571641237030,
                  link: '',
                  title: 'How to write a proposal & Working with estimates',
                },
                {
                  id: 1571641328763,
                  link:
                    'https://docs.google.com/document/d/1K-aahY5FeIg3tfv0VrkxK9xCWEp-M7iG-Ki46y-8FEU/edit#bookmark=id.gjdgxs',
                  title: 'project requirement checklist',
                },
                {
                  id: 1571641366838,
                  link:
                    'https://docs.google.com/document/d/19W-e8ZkiYlTG_FSXZkqdTbNrRKTuXJMQ/edit',
                  title: 'proposal template',
                },
              ],
              id: 'stage5',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Proposal Sent',
            },
            stage6: {
              challenges: [
                {
                  id: 1571640100848,
                  link: '',
                  title: 'Weekly updates and milestone payments',
                },
                {
                  id: 1571640161144,
                  link: '',
                  title: 'Getting started . with a project Management platform',
                },
                {
                  id: 1571640858524,
                  link:
                    'https://docs.google.com/document/d/1gJz980wEEwSw8BbyoFgQUPBJkR4frL4c/edit',
                  title: 'Create a welcome kit',
                },
                {
                  id: 1571641268391,
                  link:
                    'https://docs.google.com/document/d/1q0345vcYSGcut4V4y-r1_cJcqrDpdqB2/edit?dls=true',
                  title: 'onboarding process',
                },
                {
                  id: 1571641523593,
                  link:
                    'https://docs.google.com/document/d/1Hha9PP-81gvQGyHUFu_e-NDvIzmLhdwX/edit?dls=true',
                  title: 'Clients Guide to providing Feedback',
                },
              ],
              id: 'stage6',
              people: ['VQs9wjPsh4zxqPusWWvh', 'Kq9jP1Jtof1FaudZGdJt'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Project Started',
            },
            stage7: {
              challenges: [
                {
                  id: 1571640171772,
                  link: '',
                  title: ' Final handover with project metrics',
                },
                {
                  id: 1571640185095,
                  link: '',
                  title: ' Case study and final payment',
                },
                {
                  id: 1571640884343,
                  link: '',
                  title: 'A guide to simple book keeping',
                },
                {
                  id: 1571641475689,
                  link:
                    'https://docs.google.com/document/d/1_WWpl8JZ2l_5PE8_sQKd4QGKPIDY1_dL/edit#bookmark=id.gjdgxs',
                  title: 'client evaluation',
                },
                {
                  id: 1571641592207,
                  link:
                    'https://docs.google.com/document/d/1VQ3imYfdt9r015ATVTZyvJyrCj2o87Ae/edit',
                  title: 'feedback Questionannaire',
                },
              ],
              id: 'stage7',
              people: ['person2', 'person1', 'person4'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Handover Complete',
            },
            stage8: {
              challenges: [
                {
                  id: 1571641675249,
                  link:
                    'https://docs.google.com/document/d/1Bz0UBj0mcu3m40AnW2qCg7mVJjilKxnJ/edit',
                  title: 'Follow up for testimonial',
                },
                {
                  id: 1571641693166,
                  link: '',
                  title: 'How to ask for a great testimonial',
                },
              ],
              id: 'stage8',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Testimonial Received',
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
        contactId: 'YQeCZYL9CLRwgpaLA5RW',
        dashboard: {
          people: {
            Kq9jP1Jtof1FaudZGdJt: {
              id: 'Kq9jP1Jtof1FaudZGdJt',
              name: 'sum tooxdd',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FKq9jP1Jtof1FaudZGdJt.png?alt=media&token=648162f5-ac7d-4d3d-b8c8-ca9f5b99703a',
            },
            VQs9wjPsh4zxqPusWWvh: {
              id: 'VQs9wjPsh4zxqPusWWvh',
              name: 'Sifti',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FVQs9wjPsh4zxqPusWWvh.png?alt=media&token=1ee374cb-f13a-41b9-b984-68a702d8a38a',
            },
            YQeCZYL9CLRwgpaLA5RW: {
              id: 'YQeCZYL9CLRwgpaLA5RW',
              name: 'm',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FYQeCZYL9CLRwgpaLA5RW.png?alt=media&token=22e7a52d-8e94-4419-9a6b-1b335c0e9bbf',
            },
            dUlbJHquV2EnXjYUMkIJ: {
              id: 'dUlbJHquV2EnXjYUMkIJ',
              name: 'Sahar',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FdUlbJHquV2EnXjYUMkIJ.png?alt=media&token=d62dede3-fb6d-4ca9-a755-23b2c2741a5b',
            },
            person1: {
              id: 'person1',
              name: '🐟',
              photoURL:
                'https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg',
            },
            person2: {
              id: 'person2',
              name: '🌳',
              photoURL: 'http://tachyons.io/img/avatar_1.jpg',
            },
            person3: {
              id: 'person3',
              name: '🐟',
              photoURL: 'http://mrmrs.github.io/photos/p/3.jpg',
            },
            person4: {
              id: 'person4',
              name: '🌳',
              photoURL: 'http://mrmrs.github.io/photos/p/4.jpg',
            },
            person5: {
              id: 'person5',
              name: '🌳',
              photoURL: 'http://mrmrs.github.io/photos/p/5.jpg',
            },
            tqshoC4BCf4NnKLSt82T: {
              id: 'tqshoC4BCf4NnKLSt82T',
              name: 'Joan #dev',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FtqshoC4BCf4NnKLSt82T.png?alt=media&token=72cb00d9-72eb-4376-b616-ee1457f8f85e',
            },
          },
          stageOrder: [
            'stage4',
            'stage6',
            'stage1',
            'stage5',
            'stage2',
            'stage3',
            'stage7',
            'stage8',
          ],
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
                  id: 1571640331505,
                  link:
                    'https://docs.google.com/document/d/1Y1CY-B4DkKjjpYh0_4ENq8LAR7gFJltR/edit#',
                  title: 'Create a referral kit',
                },
              ],
              id: 'stage2',
              people: ['person3', 'person5'],

              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Contacted',
            },
            stage3: {
              challenges: [
                {
                  id: 1571640018747,
                  link: '',
                  title: 'Develop an Initial Call SOP',
                },
                {
                  id: 1571640036363,
                  link: '',
                  title:
                    'Sent a follow up email summarizing what they want and example proposal and how I work (explain your process and set expectations)',
                },
                {
                  id: 1571641088204,
                  link:
                    'https://docs.google.com/document/d/1hbj6Yrhy-mBvv3yUNxnDIx2aC4y47z_4/edit#bookmark=id.gjdgxs',
                  title: 'Project Goals Questionnaire',
                },
              ],
              id: 'stage3',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Brief Established',
            },
            stage4: {
              challenges: [
                {
                  id: 1571640054830,
                  link: '',
                  title: 'Sent contract and invoice',
                },
                {
                  id: 1571640139902,
                  link: '',
                  title:
                    'How to get paid. Upfront, half and half or milestone payments?',
                },
                {
                  id: 1571641142368,
                  link:
                    'https://docs.google.com/document/d/18f7iAMpXrvs6lSSnMhBl8brE-NwQuMrx/edit',
                  title: 'Invoicing Tools or templates ',
                },
                {
                  id: 1571641423290,
                  link:
                    'https://drive.google.com/drive/u/0/folders/187petPPv0FmTaGMRqGDu9fWx3j8uj45v',
                  title: 'Another invoice template ',
                },
              ],
              id: 'stage4',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Invoice Sent',
            },
            stage5: {
              challenges: [
                {
                  id: 1571640067127,
                  link: '',
                  title:
                    ' Sent proposal (deliverables, timeline, and shared responsibilities)',
                },
                {
                  id: 1571640078995,
                  link: '',
                  title:
                    'Email confirmation of deliverables, process, timeline, and shared responsibilities before first milestone is paid',
                },
                {
                  id: 1571641237030,
                  link: '',
                  title: 'How to write a proposal & Working with estimates',
                },
                {
                  id: 1571641328763,
                  link:
                    'https://docs.google.com/document/d/1K-aahY5FeIg3tfv0VrkxK9xCWEp-M7iG-Ki46y-8FEU/edit#bookmark=id.gjdgxs',
                  title: 'project requirement checklist',
                },
                {
                  id: 1571641366838,
                  link:
                    'https://docs.google.com/document/d/19W-e8ZkiYlTG_FSXZkqdTbNrRKTuXJMQ/edit',
                  title: 'proposal template',
                },
              ],
              id: 'stage5',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Proposal Sent',
            },
            stage6: {
              challenges: [
                {
                  id: 1571640100848,
                  link: '',
                  title: 'Weekly updates and milestone payments',
                },
                {
                  id: 1571640161144,
                  link: '',
                  title: 'Getting started . with a project Management platform',
                },
                {
                  id: 1571640858524,
                  link:
                    'https://docs.google.com/document/d/1gJz980wEEwSw8BbyoFgQUPBJkR4frL4c/edit',
                  title: 'Create a welcome kit',
                },
                {
                  id: 1571641268391,
                  link:
                    'https://docs.google.com/document/d/1q0345vcYSGcut4V4y-r1_cJcqrDpdqB2/edit?dls=true',
                  title: 'onboarding process',
                },
                {
                  id: 1571641523593,
                  link:
                    'https://docs.google.com/document/d/1Hha9PP-81gvQGyHUFu_e-NDvIzmLhdwX/edit?dls=true',
                  title: 'Clients Guide to providing Feedback',
                },
              ],
              id: 'stage6',
              people: ['VQs9wjPsh4zxqPusWWvh', 'Kq9jP1Jtof1FaudZGdJt'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Project Started',
            },
            stage7: {
              challenges: [
                {
                  id: 1571640171772,
                  link: '',
                  title: ' Final handover with project metrics',
                },
                {
                  id: 1571640185095,
                  link: '',
                  title: ' Case study and final payment',
                },
                {
                  id: 1571640884343,
                  link: '',
                  title: 'A guide to simple book keeping',
                },
                {
                  id: 1571641475689,
                  link:
                    'https://docs.google.com/document/d/1_WWpl8JZ2l_5PE8_sQKd4QGKPIDY1_dL/edit#bookmark=id.gjdgxs',
                  title: 'client evaluation',
                },
                {
                  id: 1571641592207,
                  link:
                    'https://docs.google.com/document/d/1VQ3imYfdt9r015ATVTZyvJyrCj2o87Ae/edit',
                  title: 'feedback Questionannaire',
                },
              ],
              id: 'stage7',
              people: ['person2', 'person1', 'person4'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Handover Complete',
            },
            stage8: {
              challenges: [
                {
                  id: 1571641675249,
                  link:
                    'https://docs.google.com/document/d/1Bz0UBj0mcu3m40AnW2qCg7mVJjilKxnJ/edit',
                  title: 'Follow up for testimonial',
                },
                {
                  id: 1571641693166,
                  link: '',
                  title: 'How to ask for a great testimonial',
                },
              ],
              id: 'stage8',
              people: ['YQeCZYL9CLRwgpaLA5RW'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Testimonial Received',
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
        contactId: 'YQeCZYL9CLRwgpaLA5RW',
        dashboard: {
          people: {
            Kq9jP1Jtof1FaudZGdJt: {
              id: 'Kq9jP1Jtof1FaudZGdJt',
              name: 'sum tooxdd',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FKq9jP1Jtof1FaudZGdJt.png?alt=media&token=648162f5-ac7d-4d3d-b8c8-ca9f5b99703a',
            },
            VQs9wjPsh4zxqPusWWvh: {
              id: 'VQs9wjPsh4zxqPusWWvh',
              name: 'Sifti',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FVQs9wjPsh4zxqPusWWvh.png?alt=media&token=1ee374cb-f13a-41b9-b984-68a702d8a38a',
            },
            YQeCZYL9CLRwgpaLA5RW: {
              id: 'YQeCZYL9CLRwgpaLA5RW',
              name: 'm',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FYQeCZYL9CLRwgpaLA5RW.png?alt=media&token=22e7a52d-8e94-4419-9a6b-1b335c0e9bbf',
            },
            dUlbJHquV2EnXjYUMkIJ: {
              id: 'dUlbJHquV2EnXjYUMkIJ',
              name: 'Sahar',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FdUlbJHquV2EnXjYUMkIJ.png?alt=media&token=d62dede3-fb6d-4ca9-a755-23b2c2741a5b',
            },
            person1: {
              id: 'person1',
              name: '🐟',
              photoURL:
                'https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg',
            },
            person2: {
              id: 'person2',
              name: '🌳',
              photoURL: 'http://tachyons.io/img/avatar_1.jpg',
            },
            person3: {
              id: 'person3',
              name: '🐟',
              photoURL: 'http://mrmrs.github.io/photos/p/3.jpg',
            },
            person4: {
              id: 'person4',
              name: '🌳',
              photoURL: 'http://mrmrs.github.io/photos/p/4.jpg',
            },
            person5: {
              id: 'person5',
              name: '🌳',
              photoURL: 'http://mrmrs.github.io/photos/p/5.jpg',
            },
            tqshoC4BCf4NnKLSt82T: {
              id: 'tqshoC4BCf4NnKLSt82T',
              name: 'Joan #dev',
              photoURL:
                'https://firebasestorage.googleapis.com/v0/b/client-tree-dev.appspot.com/o/contacts%2FtqshoC4BCf4NnKLSt82T.png?alt=media&token=72cb00d9-72eb-4376-b616-ee1457f8f85e',
            },
          },
          stageOrder: [
            'stage4',
            'stage6',
            'stage1',
            'stage5',
            'stage2',
            'stage3',
            'stage7',
            'stage8',
          ],
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
                  id: 1571640331505,
                  link:
                    'https://docs.google.com/document/d/1Y1CY-B4DkKjjpYh0_4ENq8LAR7gFJltR/edit#',
                  title: 'Create a referral kit',
                },
              ],
              id: 'stage2',
              people: ['person3', 'person5'],

              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Contacted',
            },
            stage3: {
              challenges: [
                {
                  id: 1571640018747,
                  link: '',
                  title: 'Develop an Initial Call SOP',
                },
                {
                  id: 1571640036363,
                  link: '',
                  title:
                    'Sent a follow up email summarizing what they want and example proposal and how I work (explain your process and set expectations)',
                },
                {
                  id: 1571641088204,
                  link:
                    'https://docs.google.com/document/d/1hbj6Yrhy-mBvv3yUNxnDIx2aC4y47z_4/edit#bookmark=id.gjdgxs',
                  title: 'Project Goals Questionnaire',
                },
              ],
              id: 'stage3',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Brief Established',
            },
            stage4: {
              challenges: [
                {
                  id: 1571640054830,
                  link: '',
                  title: 'Sent contract and invoice',
                },
                {
                  id: 1571640139902,
                  link: '',
                  title:
                    'How to get paid. Upfront, half and half or milestone payments?',
                },
                {
                  id: 1571641142368,
                  link:
                    'https://docs.google.com/document/d/18f7iAMpXrvs6lSSnMhBl8brE-NwQuMrx/edit',
                  title: 'Invoicing Tools or templates ',
                },
                {
                  id: 1571641423290,
                  link:
                    'https://drive.google.com/drive/u/0/folders/187petPPv0FmTaGMRqGDu9fWx3j8uj45v',
                  title: 'Another invoice template ',
                },
              ],
              id: 'stage4',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Invoice Sent',
            },
            stage5: {
              challenges: [
                {
                  id: 1571640067127,
                  link: '',
                  title:
                    ' Sent proposal (deliverables, timeline, and shared responsibilities)',
                },
                {
                  id: 1571640078995,
                  link: '',
                  title:
                    'Email confirmation of deliverables, process, timeline, and shared responsibilities before first milestone is paid',
                },
                {
                  id: 1571641237030,
                  link: '',
                  title: 'How to write a proposal & Working with estimates',
                },
                {
                  id: 1571641328763,
                  link:
                    'https://docs.google.com/document/d/1K-aahY5FeIg3tfv0VrkxK9xCWEp-M7iG-Ki46y-8FEU/edit#bookmark=id.gjdgxs',
                  title: 'project requirement checklist',
                },
                {
                  id: 1571641366838,
                  link:
                    'https://docs.google.com/document/d/19W-e8ZkiYlTG_FSXZkqdTbNrRKTuXJMQ/edit',
                  title: 'proposal template',
                },
              ],
              id: 'stage5',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Proposal Sent',
            },
            stage6: {
              challenges: [
                {
                  id: 1571640100848,
                  link: '',
                  title: 'Weekly updates and milestone payments',
                },
                {
                  id: 1571640161144,
                  link: '',
                  title: 'Getting started . with a project Management platform',
                },
                {
                  id: 1571640858524,
                  link:
                    'https://docs.google.com/document/d/1gJz980wEEwSw8BbyoFgQUPBJkR4frL4c/edit',
                  title: 'Create a welcome kit',
                },
                {
                  id: 1571641268391,
                  link:
                    'https://docs.google.com/document/d/1q0345vcYSGcut4V4y-r1_cJcqrDpdqB2/edit?dls=true',
                  title: 'onboarding process',
                },
                {
                  id: 1571641523593,
                  link:
                    'https://docs.google.com/document/d/1Hha9PP-81gvQGyHUFu_e-NDvIzmLhdwX/edit?dls=true',
                  title: 'Clients Guide to providing Feedback',
                },
              ],
              id: 'stage6',
              people: ['VQs9wjPsh4zxqPusWWvh', 'Kq9jP1Jtof1FaudZGdJt'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Project Started',
            },
            stage7: {
              challenges: [
                {
                  id: 1571640171772,
                  link: '',
                  title: ' Final handover with project metrics',
                },
                {
                  id: 1571640185095,
                  link: '',
                  title: ' Case study and final payment',
                },
                {
                  id: 1571640884343,
                  link: '',
                  title: 'A guide to simple book keeping',
                },
                {
                  id: 1571641475689,
                  link:
                    'https://docs.google.com/document/d/1_WWpl8JZ2l_5PE8_sQKd4QGKPIDY1_dL/edit#bookmark=id.gjdgxs',
                  title: 'client evaluation',
                },
                {
                  id: 1571641592207,
                  link:
                    'https://docs.google.com/document/d/1VQ3imYfdt9r015ATVTZyvJyrCj2o87Ae/edit',
                  title: 'feedback Questionannaire',
                },
              ],
              id: 'stage7',
              people: ['person2', 'person1', 'person4'],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Handover Complete',
            },
            stage8: {
              challenges: [
                {
                  id: 1571641675249,
                  link:
                    'https://docs.google.com/document/d/1Bz0UBj0mcu3m40AnW2qCg7mVJjilKxnJ/edit',
                  title: 'Follow up for testimonial',
                },
                {
                  id: 1571641693166,
                  link: '',
                  title: 'How to ask for a great testimonial',
                },
              ],
              id: 'stage8',
              people: [],
              subtitle:
                'Ipsum lorem, perhaps put an optional little description here, thingy\n      thingy, maybe, not sure yet...',
              title: 'Testimonial Received',
            },
          },
        },
      };
      expect(getStage(fakeProps.dashboard, fakeProps.contactId)).toBeFalsy();
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

    // test.skip('markActivityComplete epic produces correct actions', () => {
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

    test('stats should start off with minimum ratios 3:10', done => {
      setStatDefaults.mockResolvedValueOnce();

      const statsBoxService = interpret(statsMachine)
        .onTransition(state => {
          if (state.matches('modal')) {
            expect(setStatDefaults).toHaveBeenCalled();
            done();
          }
        })
        .start();

      statsBoxService.send('INCOMPLETE');
      statsBoxService.send('MODAL_OPENED');
    });

    test.skip('only reveal stats on hover', () => false);

    test.skip('show activities needed minus activties completed', () => false);

    test.skip('support text under add someone to your network should say, on hover, to begin with just add 5 people that you have  been meaning to touch base with for a while now.', () =>
      false);
    test.skip('loading indicators for people page, when loading, but also when creating', () =>
      false);

    test.skip('no infinity or negative numbers should show in teh stats', () =>
      false);

    test.skip('number of activities must always be higher that the number of  potential projects', () =>
      false);
  });
});
