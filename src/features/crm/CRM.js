import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { initialData } from './initialData';

const crmPropTypes = {
  welcomeMessage: PropTypes.string.isRequired,
};
const crmDefaultProps = {};

export function CRM({ welcomeMessage }) {
  const [state, setState] = React.useState(initialData);

  const { stageOrder } = state;

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

    setState(newMultiState);
  };
  return (
    <div>
      <h1 className="mt0 tc">{welcomeMessage.header}</h1>
      <h3 className="mt0 tc gray">{welcomeMessage.byline}</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="allStages" type="stages">
          {({ droppableProps, innerRef, placeholder }) => (
            <ul className="list pl0" ref={innerRef} {...droppableProps}>
              {stageOrder &&
                stageOrder.map((stageId, index) => {
                  const stage = state.stages[stageId];
                  const people = stage.people.map(
                    personId => state.people[personId]
                  );
                  return (
                    <div ref={innerRef} {...droppableProps} key={stageId}>
                      <Stages
                        stageId={stageId}
                        index={index}
                        people={people}
                        stage={stage}
                      />
                    </div>
                  );
                })}
              {placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
CRM.propTypes = crmPropTypes;
CRM.defaultProps = crmDefaultProps;

const stagesPropTypes = {
  stageId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      photoURL: PropTypes.string.isRequired,
    })
  ).isRequired,
  stage: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  }).isRequired,
};
const stagesDefaultProps = {};

function Stages({ stageId, index, people, stage }) {
  return (
    <Draggable draggableId={stageId} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="bg-white-80 br3"
        >
          <Droppable droppableId={stageId} direction="horizontal" type="people">
            {({ droppableProps, innerRef }, snapshot) => (
              <li
                className="pa3 pa4-ns bb b--black-10"
                ref={innerRef}
                {...droppableProps}
              >
                <b className="db f3 mb1" {...provided.dragHandleProps}>
                  {stage.title}
                </b>
                <small className="f5 db lh-copy measure o-50">
                  {stage.subtitle}
                </small>

                <div
                  className={`br3 flex ${snapshot.isDraggingOver &&
                    'bg-light-blue'}`}
                  style={{
                    transition: 'background-color 1s ease',
                  }}
                >
                  {people &&
                    people.map(({ id, name, photoURL }, _index) => (
                      <Peoples
                        id={id}
                        index={_index}
                        photoURL={photoURL}
                        name={name}
                      />
                    ))}
                </div>
              </li>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

Stages.propTypes = stagesPropTypes;
Stages.defaultProps = stagesDefaultProps;

const peoplesPropTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  photoURL: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
const peoplesDefaultProps = {};

function Peoples({ id, index, photoURL, name }) {
  return (
    <Draggable draggableId={id} key={id} index={index}>
      {(provided, snapshot) => (
        <div
          className="tc "
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <img
            src={photoURL}
            className={`${snapshot.isDragging &&
              'ba bg-white-70 bw3'} dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer`}
            title={name}
            alt={name}
          />
          {/* <h1 className="f3 mb2">{name}</h1>
      <h2 className="f5 fw4 gray mt0">{name}</h2> */}
        </div>
      )}
    </Draggable>
  );
}

Peoples.propTypes = peoplesPropTypes;
Peoples.defaultProps = peoplesDefaultProps;
