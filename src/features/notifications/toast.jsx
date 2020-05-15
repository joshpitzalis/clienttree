import React from 'react'
import { Subject } from 'rxjs'
import { delay, tap } from 'rxjs/operators'

export const toast$ = new Subject()

const useNotification = notificationStream$ => {
  const [_message, setMessage] = React.useState('')
  const [_type, setType] = React.useState('')
  const [_from, setFrom] = React.useState('')
  React.useEffect(() => {
    const messages = notificationStream$
      .pipe(
        tap(error => {
          const { type, message, from } = error
          setMessage(message)
          setType(type)
          setFrom(from)
        }),
        delay(5000),
        tap(() => {
          setMessage('')
          setType('')
        })
      )
      .subscribe()

    return () => messages.unsubscribe()
  }, [notificationStream$])
  const clear = () => setMessage('')
  return [_message, clear, _type, _from]
}

const Banner = () => {
  const [message, clear, type, from] = useNotification(toast$)

  return (
    <>
      {message && (
        <div
          className={`w-100 flex justify-between
${(type === 'ERROR' && ' bg-red-500 p-4') ||
  (type === 'SUCCESS' && ' bg-green-500 p-4') ||
  'bg-blue-500 p-4'}`}
        >
          <div className='flex'>
            <div className='flex-shrink-0'>
              {type === 'ERROR' && <svg className='h-5 w-5 text-red-800' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>}

              {type === 'SUCCESS' && <svg className='h-5 w-5 text-green-800' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>}
            </div>
            <div className='ml-3'>
              <h3 className='text-sm leading-5 font-medium text-gray-200'>
                {`${message} ${from ? `| ${from}` : ''} `}
              </h3>
            </div>
          </div>
          <button className='self-end text-gray-200 hover:bg-white-100 focus:bg-white-100  p-1.5  focus:outline-none transition ease-in-out duration-150' onClick={() => clear()}>
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
            </svg>
          </button>

        </div>

      )}
    </>
  )
}
export default Banner
