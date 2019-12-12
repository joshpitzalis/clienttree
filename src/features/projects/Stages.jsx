import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
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
              <SingleStage
                innerRef={innerRef}
                droppableProps={droppableProps}
                people={people}
                setSelectedUser={setSelectedUser}
                setVisibility={setVisibility}
                snapshot={snapshot}
                provided={provided}
                stage={stage}
              />
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
Stages.propTypes = stagesPropTypes;
Stages.defaultProps = stagesDefaultProps;

export const SingleStage = ({
  innerRef,
  droppableProps,
  people,
  setSelectedUser,
  setVisibility,
  snapshot,
  provided,
  stage,
}) => (
  <li className="pa3 pa4-ns bb b--black-10" ref={innerRef} {...droppableProps}>
    <details>
      <summary>
        <>
          <EditableTitle
            dragHandleProps={provided.dragHandleProps}
            stage={stage}
          />

          {/* <small className="f5 db lh-copy measure gray">
           {stage.subtitle}
          </small> */}

          <div
            className={`br3 flex ${snapshot.isDraggingOver &&
              'bg-light-blue h4'}`}
            style={{
              transition: 'background-color 1s ease',
            }}
          >
            {people && people.length
              ? people
                  .filter(peep => peep && peep.id)
                  .map(({ id, name, photoURL }, _index) => (
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
);

SingleStage.propTypes = {
  innerRef: PropTypes.func.isRequired,
  droppableProps: PropTypes.shape({
    'data-react-beautiful-dnd-droppable': PropTypes.string,
  }).isRequired,
  people: PropTypes.arrayOf(PropTypes.any.isRequired),
  setSelectedUser: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired,
  snapshot: PropTypes.any.isRequired,
  provided: PropTypes.shape({
    dragHandleProps: PropTypes.func,
  }).isRequired,
  stage: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    people: PropTypes.any,
  }).isRequired,
};

SingleStage.defaultProps = {};

function EditableTitle({ dragHandleProps, stage }) {
  const { title, id } = stage;
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  React.useEffect(() => {
    setSaving(false);
    setEditable(false);
    setTitleValue(title);
  }, [title]);
  return (
    <>
      {editable ? (
        <button type="button" className="bn pointer">
          <div className="w-100">
            <input
              className="dib border-box hover-black  measure ba b--black-20 pa2 br2"
              value={titleValue}
              data-testid="editableTitle"
              onChange={e => {
                setSaving(true);
                setTitleValue(e.target.value);
                dispatch({
                  type: 'projects/updateTitle',
                  payload: {
                    title: e.target.value,
                    stageId: id,
                  },
                });
              }}
            />
            {saving ? (
              <small className="dib red ml3">Saving...</small>
            ) : (
              <button
                type="button"
                className="bn pointer ml3 dib"
                onClick={() => setEditable(false)}
              >
                <small className="red">Close</small>
              </button>
            )}
          </div>
        </button>
      ) : (
        <button
          type="button"
          onDoubleClick={() => setEditable(true)}
          className="bn"
        >
          <b className="db f3 mb1" {...dragHandleProps}>
            {title}
          </b>
        </button>
      )}
    </>
  );
}

EditableTitle.propTypes = {
  dragHandleProps: PropTypes.func.isRequired,
  stage: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

EditableTitle.defaultProps = {};
