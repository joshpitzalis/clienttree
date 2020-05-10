import React from 'react'
import { Toggle } from '@duik/it'
import { useImmerReducer } from 'use-immer'
import firebase from '../../../utils/firebase'
import Transition from '../../../utils/transition.js'
import { ErrorBoundary } from 'react-error-boundary'

function actions (draft, action) {
  switch (action.type) {
    case 'IMAGE_UPLOADED':
      draft.image = action.payload
      break

    case 'IMAGE_ERRORED':
      draft.errors = { ...draft.errors, image: action.payload }
      break
  }
}
/* eslint-disable react/prop-types */
function ErrorFallback ({ error, componentStack, resetErrorBoundary }) {
  return (
    <div className="bg-red-300 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
        Something went wrong 😱
            </h3>
            <div className="mt-2 max-w-xl text-sm leading-5 text-gray-500">
              <p>
                {error.message && error.message}
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <span className="inline-flex rounded-md shadow-sm">

              <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150" onClick={resetErrorBoundary}>
          Reset
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>

  )
}

export const PersonCard = () => {
  const [state, dispatch] = useImmerReducer(actions, {
    errors: {
    },
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    name: 'Derek Foster'

  })

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => { }}
    >

      <div className="bg-white shadow overflow-hidden  sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
        Edit Contact Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
        Click on any field to edit it.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-0">
          <dl>
            <ImageRow dispatch={dispatch} image={state.image} />
            <NameRow dispatch={dispatch} name={state.name}/>
            <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
            Email address
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
            derekfoster@example.com
              </dd>
            </div>
            <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
            Added to workboard
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                <Toggle checked={true} onChange={() => {
                }} data-testid='dashSwitch' />
              </dd>
            </div>

            <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
            Past Interactions
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md">

                  <div className="mt-1 sm:mt-0 sm:col-span-2 p-3">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <textarea id="about" rows="5" className="p-3 form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"></textarea>
                    </div>
                    <div className='flex justify-between items-baseline'><p className="mt-2 text-sm text-gray-500">Sun 10 March</p>
                      <div><button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-700   focus:outline-none transition ease-in-out duration-150"
                        onClick={() => { }}>
                  Cancel
                      </button>
                      <button type="button" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150"
                        onClick={() => { }}>
                  Save
                      </button></div></div>

                  </div>

                  <li className="pl-3 pr-4 py-3 flex items-baseline text-sm leading-5">

                    <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-50 focus:outline-none focus:border-green-300 focus:shadow-outline-green active:bg-green-200 transition ease-in-out duration-150"
                      onClick={() => { }}>
                  Add a new interaction
                    </button>
                  </li>
                  <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                    <div className="w-0 flex-1 flex items-center">
                      <span className="ml-2 flex-1 w-0 truncate">
                    Fugiat ipsum ipsum deserunt culpa aute sint...
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a href="#" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
                    a week ago
                      </a>
                    </div>
                  </li>
                  <li className="border-t border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                    <div className="w-0 flex-1 flex items-center">

                      <span className="ml-2 flex-1 w-0 truncate">
                    Fugiat ipsum ipsum deserunt culpa aute sint...
                      </span>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      <a href="#" className="font-medium text-green-600 hover:text-green-500 transition duration-150 ease-in-out">
                    16 Jan 2020
                      </a>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
            <div className="border-t border-gray-200 p-5">
              <div className="flex justify-between items-center ">

                <span className=" ">
                  <p className='text-red'>Delete Contact</p>
                </span>
                <div className="">
                  <span className="inline-flex rounded-md shadow-sm">
                    <button type="button" className="inline-flex justify-center mt-1 py-2 px-4 border border-gray-300 rounded-md text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out">
                  Cancel
                    </button>
                  </span>
                  <span className="ml-3 inline-flex rounded-md shadow-sm">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out">
                  Save
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </ErrorBoundary>)
}

/* eslint-disable react/prop-types */
function ImageRow ({ dispatch, image }) {
  const handleImageUpload = async (
    e
  ) => {
    const imageFile = e.target.files && e.target.files[0]

    if (imageFile &&
      imageFile.type !== 'image/jpeg' &&
      imageFile.type !== 'image/gif' &&
      imageFile.type !== 'image/jpg' &&
      imageFile.type !== 'image/png'
    ) {
      dispatch({ type: 'IMAGE_ERRORED', payload: 'Images can only be jpeg, jpg, png or gif' })
      return
    }
    if (imageFile.size > 5000000) {
      dispatch({ type: 'IMAGE_ERRORED', payload: 'Images can only be 5mb or less' })
      return
    }
    if (imageFile) {
      try {
        dispatch({ type: 'IMAGE_ERRORED', payload: 'Uploading...' })
        const photoURL = await
        firebase
          .storage()
          .ref(`contacts/${+new Date()}.png`)
          .put(imageFile)
          .then(({ ref }) => ref.getDownloadURL())
        dispatch({ type: 'IMAGE_UPLOADED', payload: photoURL })
      } catch (error) {
        dispatch({ type: 'IMAGE_ERRORED', payload: error })
      }
    }
  }

  return (<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
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

/* eslint-disable react/prop-types */
function NameRow ({ dispatch, name }) {
  const [editable, setEditability] = React.useState(false)
  const [error] = React.useState('I am an error message')

  return (<div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5 ${editable && 'h-32'}`}>
    <dt className="text-sm leading-5 font-medium text-gray-500">
            Name
    </dt>
    <div className={'relative'}>
      <>
        <Transition show={editable} enter='transition ease-in duration-1000 transform absolute' enterFrom='opacity-0' enterTo='opacity-100' leave='transition ease-out duration-500 transform' leaveFrom='opacity-100' leaveTo='opacity-0 '>
          <div
            className='w-full'
          >
            <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700 hidden">Email</label>
            <div className="mt-1 rounded-md shadow-sm">
              <input id="email" className="db border-box w-100 measure-narrow ba b--black-20 pa3 br2 mb2 " placeholder="you@example.com" value={name} aria-invalid="true" aria-describedby="email-error" />
              {error && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500 relative" style={{ bottom: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>}
            </div>
            {error &&
            <p className="mt-2 text-sm text-red-600" id="email-error">{
              error
            }</p>
            }
          </div>
        </Transition>

        <Transition show={!editable} enter='transition ease-in duration-1000 transform absolute' enterFrom='opacity-0 scale-95 ' enterTo='opacity-100 scale-100 h-auto' leave='transition ease-out duration-300 transform' leaveFrom='opacity-100' leaveTo='opacity-0'><dd
          className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0
      cursor-pointer sm:col-span-2 "
          onClick={() => setEditability(true)}>
          <svg className="inline-block h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg> <p className='pl-1 pb-1 inline-block'
          >{name}</p></dd></Transition>
      </>

    </div>
  </div>
  )
}
