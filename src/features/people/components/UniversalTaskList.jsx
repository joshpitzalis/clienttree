import React from 'react'
import PropTypes from 'prop-types'
import { collection } from 'rxfire/firestore'
import { map } from 'rxjs/operators'
import { useDispatch } from 'react-redux'
import firebase from '../../../utils/firebase'
import { TaskBox } from './TaskBox'

const helpfulPropTypes = {
  myUid: PropTypes.string.isRequired
}
const helpfulDefaultProps = {}

/* eslint-disable react/prop-types */
export const HelpfulTaskList = ({ myUid, insights }) => {
  const [helpfulTasks, setHelpfulTasks] = React.useState([])

  const dispatch = useDispatch()
  React.useEffect(() => {
    const subscription = collection(
      firebase
        .firestore()
        .collectionGroup('helpfulTasks')
        .orderBy('dueDate')
        .where('connectedTo', '==', myUid)
        .where('dateCompleted', '==', null)
    )
      .pipe(map(docs => docs.map(d => d.data())))
      .subscribe(tasks => tasks && setHelpfulTasks(tasks))
    return () => subscription.unsubscribe()
  }, [myUid])

  return (
    <div data-testid='universalTaskList' className={` ${!insights && 'pt5'}`}>
      {helpfulTasks &&
        helpfulTasks.map(
          ({ taskId, name, dateCompleted, completedFor, photoURL, dueDate }) =>
            completedFor && (
              <TaskBox
                key={taskId}
                taskId={taskId}
                name={name}
                dateCompleted={dateCompleted}
                myUid={myUid}
                completedFor={completedFor}
                photoURL={photoURL}
                dispatch={dispatch}
                dueDate={dueDate}
              />
            )
        )}
    </div>
  )
}

HelpfulTaskList.propTypes = helpfulPropTypes
HelpfulTaskList.defaultProps = helpfulDefaultProps
