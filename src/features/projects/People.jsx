import React from 'react'
import PropTypes from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'

const peoplesPropTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  photoURL: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  setVisibility: PropTypes.func.isRequired
}
const peoplesDefaultProps = {}

export function Peoples ({
  id,
  index,
  photoURL,
  name,
  setSelectedUser,
  setVisibility
}) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          className='tc'
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onKeyPress={() => {
            setVisibility(true)
            setSelectedUser(id)
          }}
          onClick={() => {
            setVisibility(true)
            setSelectedUser(id)
          }}
          role='button'
          tabIndex={index}
          data-testid={name}
        >
          <img
            src={photoURL}
            className={`${snapshot.isDragging &&
              'ba bg-white-70 bw3'} dib ba b--black-10 db br-100 w2 w3-ns h2 h3-ns mv3 mr3 pointer`}
            title={name}
            alt={name}
          />
        </div>
      )}
    </Draggable>
  )
}
Peoples.propTypes = peoplesPropTypes
Peoples.defaultProps = peoplesDefaultProps
