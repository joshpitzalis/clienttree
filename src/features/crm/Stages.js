import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Peoples } from './People';
// import { ChallengeBox } from './ChallengeBox';

const stagesPropTypes = {
  stageId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired,
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      photoURL: PropTypes.string.isRequired,
    })
  ).isRequired,
  stage: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
  }).isRequired,
  // challenges: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     title: PropTypes.string.isRequired,
  //     link: PropTypes.string.isRequired,
  //   })
  // ).isRequired,
  // userId: PropTypes.string.isRequired,
};
const stagesDefaultProps = {};
export function Stages({
  stageId,
  index,
  people,
  stage,
  setSelectedUser,
  setVisibility,
  // challenges,
  // userId,
}) {
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
                <details>
                  <summary>
                    <>
                      <b className="db f3 mb1" {...provided.dragHandleProps}>
                        {stage.title}
                      </b>
                      <small className="f5 db lh-copy measure gray">
                        {stage.subtitle}
                      </small>

                      <div
                        className={`br3 flex ${snapshot.isDraggingOver &&
                          'bg-light-blue h4'}`}
                        style={{
                          transition: 'background-color 1s ease',
                        }}
                      >
                        {people && people.length
                          ? people.map(({ id, name, photoURL }, _index) => (
                              <Peoples
                                id={id}
                                key={id}
                                index={_index}
                                photoURL={photoURL}
                                name={name}
                                setSelectedUser={setSelectedUser}
                                setVisibility={setVisibility}
                              />
                            ))
                          : null}
                      </div>
                    </>
                  </summary>

                  {/* <ChallengeBox
                    challenges={challenges}
                    userId={userId}
                    stageId={stageId}
                  /> */}
                </details>
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
