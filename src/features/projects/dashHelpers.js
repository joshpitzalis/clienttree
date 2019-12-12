import produce from 'immer';
// memoize this tk
export const getCurrentUser = store => store.value.user.userId;
export const getDashboardWithNewTitle = (store, payload) => {
  const { dashboard } = store.value.user;
  const { title, stageId } = payload;
  return produce(dashboard, draft => {
    draft.stages[stageId].title = title;
  });
};
export const getDashboardWithNewStage = (store, title) => {
  const { dashboard } = store.value.user;
  const id = +new Date();
  return produce(dashboard, draft => {
    draft.stages[id] = {
      id,
      title,
      people: [],
    };
    draft.stageOrder.push(id);
  });
};

export const getDashboardWithoutStage = (store, id) =>
  produce(store.value.user, draft => {
    delete draft.stages[id];
    draft.stageOrder.splice(draft.stageOrder.findIndex(todo => todo === id), 1);
  });

export const onDragEnd = ({
  result,
  state,
  setState,
  setStateToDB,
  toast$,
  userId,
  track,
  dispatch,
}) => {
  const { source, destination, draggableId, type } = result;

  // if they never drop it
  if (!destination) {
    return;
  }

  // if they dropped in the same place they started
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  // update stats module when people are dropped on to handover completed stage
  if (destination && destination.droppableId === 'stage7') {
    dispatch({ type: 'crm/newProjectCompleted' });
  }

  if (destination && destination.droppableId === 'stage2') {
    dispatch({ type: 'crm/newleadContacted' });
  }

  if (type === 'stages') {
    const newStageOrder = Array.from(state.stageOrder);
    newStageOrder.splice(source.index, 1);
    newStageOrder.splice(destination.index, 0, draggableId);
    const newState = {
      ...state,
      stageOrder: newStageOrder,
    };
    setState(newState);

    setStateToDB(userId, newState).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );

    return;
  }

  const startStage = state.stages[source.droppableId];
  const endStage = state.stages[destination.droppableId];

  // functionality for movement within a column
  if (startStage === endStage) {
    const newPeopleOrder = Array.from(startStage.people);
    newPeopleOrder.splice(source.index, 1);
    newPeopleOrder.splice(destination.index, 0, draggableId);

    const newStage = { ...startStage, people: newPeopleOrder };

    const newState = {
      ...state,
      stages: {
        ...state.stages,
        [newStage.id]: newStage,
      },
    };

    setState(newState);
    setStateToDB(userId, newState).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );
    return;
  }

  // moving from one stage to another

  const startingPeopleOrder = Array.from(startStage.people);
  startingPeopleOrder.splice(source.index, 1);
  const newStartStage = { ...startStage, people: startingPeopleOrder };

  const endPeopleOrder = Array.from(endStage.people);
  endPeopleOrder.splice(destination.index, 0, draggableId);
  const newEndStage = { ...endStage, people: endPeopleOrder };

  const newMultiState = {
    ...state,
    stages: {
      ...state.stages,
      [newStartStage.id]: newStartStage,
      [newEndStage.id]: newEndStage,
    },
  };

  if (track) {
    track('CRM Updated', {
      movedTo: newEndStage.title,
    });
  }

  setState(newMultiState);
  setStateToDB(userId, newMultiState).catch(error =>
    toast$.next({ type: 'ERROR', message: error.message || error })
  );
};
