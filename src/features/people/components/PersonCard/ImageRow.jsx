import React from 'react'
import firebase from '../../../../utils/firebase'

/* eslint-disable react/prop-types */
const validated = (imageFile, dispatch) => {
  const validTypes = 'image/jpeg' || 'image/gif' || 'image/jpg' || 'image/png'

  switch (imageFile) {
    case !imageFile:
      return false
    case imageFile.type !== validTypes:
      dispatch({
        type: 'IMAGE_ERRORED',
        payload: 'Images can only be jpeg, jpg, png or gif'
      })
      return false
    case imageFile.size > 5000000:
      dispatch({
        type: 'IMAGE_ERRORED',
        payload: 'Images can only be 5mb or less'
      })
      return false
    default:
      return true
  }
}

/* eslint-disable react/prop-types */
const handleImageUpload = async (e, dispatch) => {
  const imageFile = e.target.files && e.target.files[0]

  if (!validated(imageFile, dispatch)) {
    return
  }

  try {
    dispatch({ type: 'IMAGE_ERRORED', payload: 'Uploading...' })
    const photoURL = await firebase
      .storage()
      .ref(`contacts/${+new Date()}.png`)
      .put(imageFile)
      .then(({ ref }) => ref.getDownloadURL())
    dispatch({ type: 'IMAGE_UPLOADED', payload: photoURL })
  } catch (error) {
    dispatch({ type: 'IMAGE_ERRORED', payload: error })
  }
}

/* eslint-disable react/prop-types */
export function ImageRow ({ dispatch, image }) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
      <dt>
        <p className="text-sm leading-5 font-medium text-gray-500">Thumbnail</p>
        <p className="text-sm leading-5 font-medium text-gray-400">Click on image to update</p>
      </dt>
      <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">

        <label htmlFor='uploader' className=''>
          <img className="inline-block h-12 w-12 rounded-full cursor-pointer shadow-md hover:opacity-75 opacity-100 transition transform duration-500 ease-in-out hover:scale-125" src={image} alt="" onClick={handleImageUpload} />
          <input type='file' accept='.jpg,.jpeg,.png,.gif' className='hidden' id='uploader' data-testid='profileImageUploader' onChange={handleImageUpload} />
        </label>
      </dd>
    </div>)
}
