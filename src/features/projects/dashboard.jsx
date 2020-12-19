import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { doc } from 'rxfire/firestore'
import { catchError } from 'rxjs/operators'
import { useDispatch } from 'react-redux'
import { initialData } from './initialData'
import { setStateToDB } from './dashAPI'
import { toast$ } from '../notifications/toast'
import firebase from '../../utils/firebase'
import Portal from '../../utils/Portal'
import Modal from '../people/components/ContactModal'
import { Stages } from './Stages'
import { onDragEnd } from './dashHelpers'

const crmPropTypes = {
  welcomeMessage: PropTypes.shape({
    header: PropTypes.string,
    byline: PropTypes.string
  }).isRequired,
  userId: PropTypes.string.isRequired
}
const crmDefaultProps = {}

export function CRM ({ userId }) {
  const [state, setState] = React.useState(initialData)
  const [visible, setVisibility] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState('')
  const dispatch = useDispatch()

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
      )

    return () => subscription.unsubscribe()
  }, [userId])

  return (
    <div className='bg-base' data-testid='salesDashboard'>

      {visible && (
        <Portal
          onClose={() => {
            setVisibility(false)
            setSelectedUser('')
          }}
        >
          <Modal
            setVisibility={setVisibility}
            uid={userId}
            selectedUserUid={selectedUser}
            onClose={() => {
              setVisibility(false)
              setSelectedUser('')
            }}
          />
        </Portal>
      )}
      <div className='ma3 tc'>
        <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setVisibility(true)}>
  Add Someone New
        </button>
      </div>
      {/* <WelcomeHeader welcomeMessage={welcomeMessage} /> */}
      <DragDropContext
        onDragEnd={result =>
          onDragEnd({
            result,
            state,
            setState,
            setStateToDB,
            toast$,
            userId,
            track: window && window.analytics && window.analytics.track,
            dispatch
          })}
      >
        <Droppable droppableId='allStages' type='stages' direction='horizontal'>
          {({ droppableProps, innerRef, placeholder }) => (
            <div ref={innerRef} {...droppableProps}>
              <ul className='list pl0 pt4 flex justify-around vh-75' ref={innerRef} {...droppableProps}>
                {state &&
                  state.stageOrder &&
                  state.stageOrder.map((stageId, index) => {
                    const stage = state.stages[stageId]
                    const people =
                      stage.people &&
                      stage.people.map(personId => state.people[personId])
                    const { challenges } = stage
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
                    )
                  })}
              </ul>
              {placeholder}
              <AddStage state={state} />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
CRM.propTypes = crmPropTypes
CRM.defaultProps = crmDefaultProps

// function WelcomeHeader({ welcomeMessage }) {
//   return (
//     <>
//       <h1 className="mt3 tc">{welcomeMessage.header}</h1>
//       <h3 className="mt0 tc gray">{welcomeMessage.byline}</h3>
//     </>
//   );
// }

// WelcomeHeader.propTypes = {
//   welcomeMessage: PropTypes.shape({
//     header: PropTypes.string,
//     byline: PropTypes.string,
//   }).isRequired,
// };
// WelcomeHeader.defaultProps = {};

function AddStage ({ state }) {
  const dispatch = useDispatch()
  const [editable, setEditable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  React.useEffect(() => {
    setSaving(false)
    setEditable(false)
  }, [state])
  return (
    <div className='w-100 pa4 flex justify-center'>
      {editable ? (
        <>
          <input
            className='dib border-box hover-black measure ba b--black-20 pa2 br2'
            value={titleValue}
            data-testid='editableTitle'
            placeholder='Name your new stage...'
            onChange={e => {
              setSaving(true)
              const payload = e.target.value
              setTitleValue(payload)
              dispatch({
                type: 'projects/createNewStage',
                payload
              })
            }}
          />
          {saving ? (
            <small className='dib red ml3'>Saving...</small>
          ) : (
            <button
              type='button'
              className='bn pointer ml3 dib bg-transparent'
              onClick={() => setEditable(false)}
            >
              <small className='red '>Close</small>
            </button>
          )}
        </>
      ) : (
        <button
          type='button'
          className='b ph3 pv2 ba b--black bg-transparent grow pointer f6 br1'
          onClick={() => setEditable(true)}
        >
          Add a New Step
        </button>
      )}
    </div>
  )
}

AddStage.propTypes = {
  state: PropTypes.any.isRequired
}
AddStage.defaultProps = {}
