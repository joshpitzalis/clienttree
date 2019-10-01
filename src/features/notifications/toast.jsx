import React from 'react';
import { Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export const toast$ = new Subject();

const useNotification = notificationStream$ => {
  const [_message, setMessage] = React.useState('');
  const [_type, setType] = React.useState('');
  React.useEffect(() => {
    const messages = notificationStream$
      .pipe(
        tap(({ type, message }) => {
          setMessage(message);
          setType(type);
        }),
        delay(5000),
        tap(() => {
          setMessage('');
          setType('');
        })
      )
      .subscribe();

    return () => messages.unsubscribe();
  }, [notificationStream$]);
  const clear = () => setMessage('');
  return [_message, clear, _type];
};

const Banner = () => {
  const [message, clear, type] = useNotification(toast$);

  // type === 'SUCCESS' && type === 'ERROR'

  return (
    <>
      {message && (
        <button
          type="button"
          onClick={() => clear()}
          className={`w-100 bn flex items-center justify-center pa4 pointer
${type === 'ERROR' ? 'bg-light-red' : 'bg-lightest-blue navy'}`}
        >
          <span className="lh-title ml3">{message}</span>
        </button>
      )}
    </>
  );
};
export default Banner;
