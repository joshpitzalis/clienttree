export const handleActivityCompleted = async (
  { taskId, myUid, completedFor, setSelectedUser, setVisibility, checked },
  _inCompleteTask,
  _decrementActivityStats,
  _handleCompleteTask,
  _incrementActivityStats,
  _track,
  _getActivitiesLeft
) => {
  if (checked) {
    // if task is complete mark incomplete
    await _inCompleteTask(taskId, myUid, completedFor);
    _decrementActivityStats(myUid);
    return;
  }

  // mark task complete in db
  await _handleCompleteTask(taskId, myUid, completedFor);
  _incrementActivityStats(myUid);

  // track event in amplitude
  _track('Helped Someone');
  // if no more task for this contact then open the contact modal so people can add a next task
  _getActivitiesLeft(myUid, completedFor).then(async numberofActiveTasks => {
    if (numberofActiveTasks === 1) {
      setSelectedUser(completedFor);
      setVisibility(true);
    }
  });
};
