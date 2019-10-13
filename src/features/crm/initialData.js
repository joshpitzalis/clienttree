export const initialData = {
  people: {
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
  },
  stages: {
    stage1: {
      id: 'stage1',
      title: 'Leads',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: ['person1', 'person2', 'person5'],
    },
    stage2: {
      id: 'stage2',
      title: 'Contacted',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: ['person3', 'person4'],
    },
    stage3: {
      id: 'stage3',
      title: 'Brief Established',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: [],
    },
    stage4: {
      id: 'stage4',
      title: 'Invoice Sent',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: [],
    },
    stage5: {
      id: 'stage5',
      title: 'Proposal Sent',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: [],
    },
    stage6: {
      id: 'stage6',
      title: 'Project Started',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: [],
    },
    stage7: {
      id: 'stage7',
      title: 'Handover Complete',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: [],
    },
    stage8: {
      id: 'stage8',
      title: 'Testimonial Received',
      subtitle: `Ipsum lorem, perhaps put an optional little description here, thingy
      thingy, maybe, not sure yet...`,
      people: [],
    },
  },
  stageOrder: [
    'stage1',
    'stage2',
    'stage3',
    'stage4',
    'stage5',
    'stage6',
    'stage7',
    'stage8',
  ],
};
