export const initialData = {
  people: {
    person1: {
      id: 'person1',
      name: 'Josh 🐟',
      photoURL:
        'https://pbs.twimg.com/profile_images/673422102767251456/HYiR6yIE_400x400.jpg',
    },
  },
  stages: {
    stage1: {
      id: 'stage1',
      title: 'Leads',
      subtitle: ``,
      people: ['person1'],
    },
    stage2: {
      id: 'stage2',
      title: 'Contacted',
      subtitle: ``,
      people: [],
    },
    stage3: {
      id: 'stage3',
      title: 'Brief Established',
      subtitle: ``,
      people: [],
    },
    stage4: {
      id: 'stage4',
      title: 'Invoice Sent',
      subtitle: ``,
      people: [],
    },
    stage5: {
      id: 'stage5',
      title: 'Proposal Sent',
      subtitle: ``,
      people: [],
    },
    stage6: {
      id: 'stage6',
      title: 'Project Started',
      subtitle: ``,
      people: [],
    },
    stage7: {
      id: 'stage7',
      title: 'Handover Complete',
      subtitle: ``,
      people: [],
    },
    stage8: {
      id: 'stage8',
      title: 'Testimonial Received',
      subtitle: ``,
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
