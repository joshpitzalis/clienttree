import React from 'react'
import { Redirect } from 'react-router-dom'
import { toast$ } from '../features/notifications/toast'
import firebase from '../utils/firebase'
import { useImmerReducer } from 'use-immer'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'
import Transition from '../utils/transition.js'

function actions (draft, action) {
  switch (action.type) {
    case 'SWITCHED':
      draft.version = draft.version === 'signup' ? 'signin' : 'signup'
      draft.submitting = false
      break
    case 'SWITCHED_TO_SIGNIN':
      draft.version = 'signin'
      draft.submitting = false
      break
    case 'SWITCHED_TO_PASSWORD':
      draft.version = 'password'
      draft.submitting = false
      break
    case 'FORM_SUBMITTED':
      draft.submitting = true
      break
    case 'FORM_RESET':
      draft.email = ''
      draft.password = ''
      draft.submitting = false
      break
    case 'UPDATED_UID':
      draft.uid = action.payload
      break
    case 'UPDATED_AUTH_STATUS':
      draft.uid = action.payload
      break
  }
}

const propTypes = {
  authStatus: PropTypes.bool,
  userId: PropTypes.string
}

export const Login = ({ authStatus, userId }) => {
  const [state, dispatch] = useImmerReducer(actions, {
    version: 'signin',
    loggedInSuccessfully: false,
    uid: '',
    submitting: false
  })

  const { register, handleSubmit, errors } = useForm()

  const handleLogin = ({ email, password }) => {
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

  const handleSignup = ({ email, password }) => {
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

  const handlePasswordReset = ({ email }) => {
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

  if ((state.loggedInSuccessfully && state.uid) || (authStatus && userId)) {
    return <Redirect to={`/user/${state.uid || userId}/network`} />
  }

  return (
    <div className='min-h-full flex items-center justify-center bg-gray-50 py-20 px-4 sm:px-6 lg:px-8'>

      <div className='max-w-md w-full bg-white rounded-lg shadow-md p-5 '>
        <div className=''>
          <Transition
            show={state.version === 'signin'}
            enter="transition ease-in duration-1000 transform"
            enterFrom="opacity-0 scale-95 h-0"
            enterTo="opacity-100 scale-100 h-auto"
            leave="transition ease-out duration-1000 transform"
            leaveFrom="opacity-100 scale-100 h-auto mt-6"
            leaveTo="opacity-0 scale-95 h-0 m-0"
          >
            <h2 className='mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900'>
             Sign in to your account
            </h2>
          </Transition>
          <Transition
            show={state.version === 'signup'}
            enter="transition ease-in duration-1000 transform"
            enterFrom="opacity-0 scale-95 h-0"
            enterTo="opacity-100 scale-100 h-auto"
            leave="transition ease-out duration-1000 transform"
            leaveFrom="opacity-100 scale-100 h-auto mt-6 "
            leaveTo="opacity-0 scale-95 h-0 m-0 -translate-y-5"
          >
            <h2 className='mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900'>
            Create a new account
            </h2>
          </Transition>
          <Transition
            show={state.version === 'password'}
            enter="transition ease-in duration-100o transform"
            enterFrom="opacity-0 scale-95 h-0"
            enterTo="opacity-100 scale-100 h-auto"
            leave="transition ease-out duration-1000 transform"
            leaveFrom="opacity-100 scale-100 h-auto mt-6"
            leaveTo="opacity-0 scale-95 h-0 m-0"
          >
            <h2 className='mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900'>
            Reset your password
            </h2>
          </Transition>

          <div className='flex items-center justify-center'>
            <button onClick={() => dispatch({ type: 'SWITCHED' })}
              className='font-semibold text-base text-green-600 hover:text-green-500 focus:outline-none focus:underline transition ease-in-out duration-150 underline'>
              {state.version === 'signup' ? 'Sign in' : 'Sign up'} instead...
            </button>
          </div>
        </div>

        <form
          className='mt-8' onSubmit={handleSubmit(state.version === 'signin' ? handleLogin : state.version === 'signup' ? handleSignup : handlePasswordReset)

          }
        >
          <div className='rounded-md shadow-sm'>
            <div>
              <input
                aria-label='Email address' name='email' className={ `${state.version === 'password' ? 'rounded-md' : 'rounded-t-md rounded-none'} appearance-none  relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5`} placeholder='Email address'
                ref={register({ required: true, pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ })}
              />
            </div>
            {state.version !== 'password' && <div className='-mt-px'>
              <input
                aria-label='Password' name='password' type='password' className={`${errors.password ? 'border-red-500 focus:outline-none focus:shadow-outline' : 'border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300'} appearance-none rounded-none relative block w-full px-3 py-2 border  placeholder-gray-500 text-gray-900 rounded-b-md focus:z-10 sm:text-sm sm:leading-5`} placeholder='Password'
                ref={register({ required: true, min: 6 })}
              />
            </div>}
          </div>
          {!!Object.keys(errors).length && <ValidationBox errors={errors}/>}
          <div className='mt-6'>
            <button type='submit' className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-700 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700 transition duration-150 ease-in-out'>
              {state.submitting && <Loader
                type="Oval"
                color="#FFF"
                height={20}
                width={20}
              />}
              <span className="pl-2">
                {state.submitting ? 'Submitting...' : state.version === 'signin' ? 'Sign in' : state.version === 'signup' ? 'Sign up' : 'Reset Password'}</span>
            </button>

          </div>
        </form>
        <div className='mt-6 flex items-center justify-center'>
          <div className='text-sm leading-5 h-4'>
            <Transition
              show={state.version === 'signin'}
              enter="transition ease-in duration-100o transform"
              enterFrom="opacity-0 scale-95 h-0"
              enterTo="opacity-100 scale-100 h-auto"
              leave="transition ease-out duration-1000 transform"
              leaveFrom="opacity-100 scale-100 h-auto mt-6"
              leaveTo="opacity-0 scale-95 h-0 m-0"
            >
              <button onClick={() => dispatch({ type: 'SWITCHED_TO_PASSWORD' })} className='font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline transition ease-in-out duration-150'>
                    Forgot your password?
              </button>
            </Transition>

          </div>
        </div>
      </div>
    </div>

  )
}

Login.propTypes = propTypes

function ValidationBox ({ errors }) {
  return (<div className='mt-3'>
    {
    /* password */
    }
    {errors.password && errors.password.type === 'required' && <div className='flex items-center '><svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg><p className=' pl-2 pb-1 text-red-500 text-xs italic'>A password is required.</p></div>}
    {errors.password && errors.password.type === 'min' && <div className='flex items-center '><svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg><p className=' pl-2 pb-1 text-red-500 text-xs italic'>Your password must be atleast 6 characters.</p></div>}
    {
    /* email */
    }
    {errors.email && errors.email.type === 'required' && <div className='flex items-center '><svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg><p className=' pl-2 pb-1 text-red-500 text-xs italic'>An email is required.</p></div>}
    {errors.email && errors.email.type === 'pattern' && <div className='flex items-center '><svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" fillRule="evenodd"></path></svg><p className=' pl-2 pb-1 text-red-500 text-xs italic'>A valid email is required.</p></div>}
  </div>)
}

ValidationBox.propTypes = {
  errors: PropTypes.any
}
