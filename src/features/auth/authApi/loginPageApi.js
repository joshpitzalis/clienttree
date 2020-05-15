export const handleLogin = ({ email, password }, dispatch, firebase, toast$) => {
  dispatch({ type: 'FORM_SUBMITTED' })
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(result => {
      const { uid } = result
      dispatch({ type: 'UPDATED_UID', payload: uid })
      dispatch({ type: 'FORM_RESET' })
    })
    .then(() => dispatch({ type: 'UPDATED_AUTH_STATUS', payload: true }))
    .catch(error => {
      dispatch({ type: 'FORM_RESET' })
      toast$.next({
        type: 'ERROR',
        message: error.message || error
      })
    })
}

export const handleSignup = ({ email, password }, dispatch, firebase, toast$) => {
  dispatch({ type: 'FORM_SUBMITTED' })
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(result => {
      const { uid } = result
      dispatch({ type: 'UPDATED_UID', payload: uid })
      dispatch({ type: 'FORM_RESET' })
    })
    .then(() => dispatch({ type: 'UPDATED_AUTH_STATUS', payload: true }))
    .catch(error => {
      dispatch({ type: 'FORM_RESET' })
      toast$.next({
        type: 'ERROR',
        message: error.message || error
      })
    })
}

export const handlePasswordReset = ({ email, dispatch }, firebase, toast$) => {
  dispatch({ type: 'FORM_SUBMITTED' })
  return firebase.auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      dispatch({ type: 'FORM_RESET' })
      toast$.next({
        type: 'SUCCESS',
        message: 'Password reset email sent.'
      })
      dispatch({ type: 'SWITCHED_TO_SIGNIN' })
    }).catch(error => {
      dispatch({ type: 'FORM_RESET' })
      toast$.next({
        type: 'ERROR',
        message: error.message || error
      })
    })
}
