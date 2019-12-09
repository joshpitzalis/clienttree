import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { doc } from 'rxfire/firestore';
import { catchError } from 'rxjs/operators';
import { useDispatch } from 'react-redux';
import { initialData } from './initialData';
import { setStateToDB } from './dashAPI';
import { toast$ } from '../notifications/toast';
import firebase from '../../utils/firebase';
import Portal from '../../utils/Portal';
import { Modal } from '../people/components/ContactModal';
import { Stages } from './Stages';
import { onDragEnd } from './dashHelpers';

const crmPropTypes = {
  welcomeMessage: PropTypes.shape({
    header: PropTypes.string,
    byline: PropTypes.string,
  }).isRequired,
  userId: PropTypes.string.isRequired,
};
const crmDefaultProps = {};

export function CRM({ userId = '' }) {
  const [state, setState] = React.useState(initialData);
  const [visible, setVisibility] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState('');
  const dispatch = useDispatch();

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

  return (
    <div className="bg-base" data-testid="salesDashboard">
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
            dispatch,
          })
        }
      >
        <Droppable droppableId="allStages" type="stages">
          {({ droppableProps, innerRef, placeholder }) => (
            <div ref={innerRef} {...droppableProps}>
              <ul className="list pl0 pt4" ref={innerRef} {...droppableProps}>
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
