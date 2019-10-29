import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { doc } from 'rxfire/firestore';
import { catchError } from 'rxjs/operators';
import { initialData } from './initialData';
import { setStateToDB } from './crmAPI';
import { toast$ } from '../notifications/toast';
import firebase from '../../utils/firebase';
import Portal from '../../utils/Portal';
import { Modal } from '../network/components/ContactModal';
import { Stages } from './Stages';

const crmPropTypes = {
  welcomeMessage: PropTypes.shape({
    header: PropTypes.string,
    byline: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
};
const crmDefaultProps = {};

export function CRM({ welcomeMessage, userId = '' }) {
  const [state, setState] = React.useState(initialData);

  React.useEffect(() => {
    const subscription = doc(
      firebase
        .firestore()
        .collection('users')
        .doc(userId)
    )
      .pipe(
        catchError(error =>
          toast$.next({ type: 'ERROR', message: error.message || error })
        )
      )
      .subscribe(
        data =>
          data.data() &&
          data.data().dashboard &&
          setState(data.data().dashboard)
      );

    return () => subscription.unsubscribe();
  }, [userId]);

  const onDragEnd = result => {
    const { source, destination, draggableId, type } = result;

    // error handling
    if (!destination) {
      // if they never drop it
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      // if they dropped in the same place they started
      return;
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

    // track event in amplitude
    const { analytics } = window;
    analytics.track('CRM Updated', {
      movedTo: newEndStage.title,
    });

    setState(newMultiState);
    setStateToDB(userId, newMultiState).catch(error =>
      toast$.next({ type: 'ERROR', message: error.message || error })
    );
  };

  const [visible, setVisibility] = React.useState(false);

  const [selectedUser, setSelectedUser] = React.useState('');

  return (
    <div>
      {visible && (
        <Portal
          onClose={() => {
            setVisibility(false);
            setSelectedUser('');
          }}
        >
          <Modal
            setVisibility={setVisibility}
            uid={userId}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false);
              setSelectedUser('');
            }}
          />
        </Portal>
      )}

      <h1 className="mt0 tc">{welcomeMessage.header}</h1>
      <h3 className="mt0 tc gray">{welcomeMessage.byline}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="allStages" type="stages">
          {({ droppableProps, innerRef, placeholder }) => (
            <div ref={innerRef} {...droppableProps}>
              <ul className="list pl0" ref={innerRef} {...droppableProps}>
                {state &&
                  state.stageOrder &&
                  state.stageOrder.map((stageId, index) => {
                    const stage = state.stages[stageId];
                    const people =
                      stage.people &&
                      stage.people.map(personId => state.people[personId]);
                    const { challenges } = stage;
                    return (
                      <Stages
                        stageId={stageId}
                        index={index}
                        people={people}
                        stage={stage}
                        key={stageId}
                        setSelectedUser={setSelectedUser}
                        setVisibility={setVisibility}
                        challenges={challenges}
                        userId={userId}
                      />
                    );
                  })}
              </ul>
              {placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
CRM.propTypes = crmPropTypes;
CRM.defaultProps = crmDefaultProps;
