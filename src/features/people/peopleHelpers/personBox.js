import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { toast$ } from '../../notifications/toast';
import { setProfileImage } from '../peopleAPI';
/**
 * @param {string} contactId - contact Id of selected user
 */
export const usePersonForm = contactId => {
  const dispatch = useDispatch();

  const contact = useSelector(
    store =>
      store.contacts && store.contacts.find(person => person.uid === contactId)
  );

  const [state, setState] = React.useState({
    uid: contactId,
    name: null,
    photoURL: null,
    notes: {
      1: {
        id: 1,
        text: '',
        // lastUpdated: +new Date(),
      },
    },
    tracked: false,
    saving: null,
  });

  React.useEffect(() => {
    // prevent the epic from firing when the person box first opens
    if (state.name === undefined) {
      return;
    }
    dispatch({
      type: 'people/updateForm',
      payload: state,
    });
  }, [dispatch, state]);

  React.useEffect(() => {
    setState(prevState => {
      // this prevents the form from saving on first load
      if (prevState.saving === true) {
        return {
          ...prevState,
          ...contact,
          saving: false,
        };
      }
      return prevState;
    });
  }, [contact]);

  return [state, setState];
};

export const setImage = async ({
  e,
  setProgress,
  setState,
  state,
  contactId,
}) => {
  const imageFile = e.target.files && e.target.files[0];
  const { size, type } = imageFile;
  if (
    type !== 'image/jpeg' &&
    type !== 'image/gif' &&
    type !== 'image/jpg' &&
    type !== 'image/png'
  ) {
    setProgress('Images can only be jpeg, jpg, png or gif');
    return;
  }
  if (size > 5000000) {
    setProgress('Images can only be 5mb or less');
    return;
  }
  if (imageFile) {
    try {
      setState(prevState => ({ ...prevState, saving: true }));
      setProgress('Uploading...');
      const photoURL = await setProfileImage({
        imageFile,
        contactId,
      });
      setProgress('Click on image to upload.');
      setState(prevState => ({ ...prevState, photoURL }));
    } catch (error) {
      setState({ ...state, saving: false });
      setProgress('Click on image to upload.');
      toast$.next({
        type: 'ERROR',
        message: error,
        from: 'PersonBox/setImagePreview',
      });
    }
  }
};
