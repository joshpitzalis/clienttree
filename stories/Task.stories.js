import React from 'react';
import { action } from '@storybook/addon-actions';
import '../src/index.css';
import '@duik/it/dist/styles.css';
import centered from '@storybook/addon-centered/react';
import { TaskBox } from '../src/features/people/components/TaskBox';

export default {
  component: TaskBox,
  title: 'TaskBox',
  decorators: [centered],
  excludeStories: /.*Data$/,
};

export const taskData = {
  taskId: '123',
  name: 'Test Task',
  dateCompleted: new Date(2018, 0, 1, 9, 0),
  myUid: '2345',
  completedFor: 'yo',
  setSelectedUser: action('setSelectedUser'),
  setVisibility: action('setVisibility'),
  photoURL: 'http://tachyons.io/img/avatar_1.jpg',
  dispatch: action('dispatch'),
  dueDate: 1234,
};

export const Idle = () => <TaskBox {...taskData} />;

// export const Pinned = () => (
//   <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />
// );

// export const Archived = () => (
//   <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
// );
