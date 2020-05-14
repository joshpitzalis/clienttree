import React from 'react'
import Transition from '../../../../utils/transition.js'
/* eslint-disable react/prop-types */
export function NameRow ({ dispatch, name, errors, setErrors }) {
  const [editable, setEditability] = React.useState(!name)
  // const [errors] = React.useState('')
  return (<div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5 ${editable && 'h-32'}`}>
    <dt className="text-sm leading-5 font-medium text-gray-500">
      Name
    </dt>
    <div className={'relative'}>
      <>
        <Transition show={editable} enter='transition ease-in duration-1000 transform absolute' enterFrom='opacity-0' enterTo='opacity-100' leave='transition ease-out duration-500 transform' leaveFrom='opacity-100' leaveTo='opacity-0 '>
          <div className='w-full'>
            <label htmlFor="name" className="block text-sm font-medium leading-5 text-gray-700 hidden">Name</label>
            <div className="mt-1 rounded-md shadow-sm">
              <input id="name" className="db border-box w-100 measure-narrow ba b--black-20 pa3 br2 mb2 " placeholder="Their name..." value={name} aria-invalid="true" aria-describedby="name" type='text'
                onChange={(e) => {
                  setErrors({ ...errors, name: '' })
                  dispatch({ type: 'NAME_UPDATED', payload: e.target.value })
                }}
              />
              {errors.name && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500 relative" style={{ bottom: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>}
            </div>
            {errors.name &&
              <p className="mt-2 text-sm text-red-600" id="email-error">{errors.name}</p>}
          </div>
        </Transition>

        <Transition show={!editable} enter='transition ease-in duration-1000 transform absolute' enterFrom='opacity-0 scale-95 ' enterTo='opacity-100 scale-100 h-auto' leave='transition ease-out duration-300 transform' leaveFrom='opacity-100' leaveTo='opacity-0'><dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0
      cursor-pointer sm:col-span-2 " onClick={() => setEditability(true)}>
          <svg className="inline-block h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg> <p className='pl-1 pb-1 inline-block'>{name}</p></dd></Transition>
      </>

    </div>
  </div>)
}
