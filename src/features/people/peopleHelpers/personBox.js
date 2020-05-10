import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { toast$ } from '../../notifications/toast'
import { setProfileImage } from '../peopleAPI'
import { generateName } from './randomNameGenerator'

/**
 * @param {string} contactId - contact Id of selected user
 */
export const usePersonForm = (contactId, userId) => {
  const dispatch = useDispatch()
  const contact = useSelector(
    store =>
      store.contacts && store.contacts.find(person => person.uid === contactId)
  )

  const oneYearAgo = new Date().setFullYear(new Date().getFullYear() - 1)

  const [state, setState] = React.useState({
    userId,
    uid: contactId,
    name: generateName(),
    photoURL: null,
    notes: {
      9007199254740991: {
        id: 9007199254740991,
        text: '',
        lastUpdated: 9007199254740991
      }
    },
    lastContacted: +new Date(oneYearAgo),
    tracked: false,
    saving: null,
    email: '',
    ...contact
  })

  React.useEffect(() => {
    // prevent the epic from firing when the person box first opens
    if (state.name === null) {
      return
    }
    if (userId) {
      dispatch({
        type: 'ONBOARDING_STEP_COMPLETED',
        payload: { userId, onboardingStep: 'addedSomeone' }
      })
      dispatch({
        type: 'people/updateForm',
        payload: { userId, ...state }
      })
    }
  }, [dispatch, state, userId])

  React.useEffect(() => {
    setState(prevState => {
      // this prevents the form from saving on first load
      if (prevState.saving === true) {
        return {
          ...prevState,
          ...contact,
          saving: false
        }
      }
      return prevState
    })
  }, [contact])

  return [state, setState]
}

export const setImage = async ({
  e,
  setProgress,
  setState,
  state,
  contactId
}) => {
  const imageFile = e.target.files && e.target.files[0]
  const { size, type } = imageFile
  if (
    type !== 'image/jpeg' &&
    type !== 'image/gif' &&
    type !== 'image/jpg' &&
    type !== 'image/png'
  ) {
    setProgress('Images can only be jpeg, jpg, png or gif')
    return
  }
  if (size > 5000000) {
    setProgress('Images can only be 5mb or less')
    return
  }
  if (imageFile) {
    try {
      setState(prevState => ({ ...prevState, saving: true }))
      setProgress('Uploading...')
      const photoURL = await setProfileImage({
        imageFile,
        contactId
      })
      setProgress('Click on image to upload.')
      setState(prevState => ({ ...prevState, photoURL }))
    } catch (error) {
      setState({ ...state, saving: false })
      setProgress('Click on image to upload.')
      toast$.next({
        type: 'ERROR',
        message: error,
        from: 'PersonBox/setImagePreview'
      })
    }
  }
}
