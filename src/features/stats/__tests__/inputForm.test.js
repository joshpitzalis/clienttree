// const useDerivedProjectData = state => {
//   const projectCount = Math.ceil((state.goal - state.income) / state.average);
//   const timeLeft = state.deadline ? formatDistanceToNow(state.deadline) : null;
//   const weeks = state.deadline
//     ? Math.floor(
//         Math.abs(
//           differenceInDays(new Date(), new Date(state.deadline)) / projectCount
//         ) / 7
//       )
//     : null;

//   return [projectCount, timeLeft, weeks];
// };

describe.skip('useDerivedProjectData', () => {
  test('projectCount', () => {});
  test('timeLeft', () => {});
  test('weeks', () => {});
});
