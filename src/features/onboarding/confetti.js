import React from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
// history: ReactRouterPropTypes.history.isRequired,
// location: ReactRouterPropTypes.location.isRequired,
// match: ReactRouterPropTypes.match.isRequired,
// route: ReactRouterPropTypes.route.isRequired,
export const confetti$ = new Subject();
const useConfetti = confettiStream$ => {
  const [pour, setPour] = React.useState('');
  React.useEffect(() => {
    const messages = confettiStream$
      .pipe(
        tap(() => setPour(true)),
        delay(10000),
        tap(() => setPour(false))
      )
      .subscribe();
    return () => messages.unsubscribe();
  }, [confettiStream$]);
  return [pour];
};
export const ConfettiBanner = ({ setWelcomeMessage }) => {
  const [pour] = useConfetti(confetti$);
  const { width, height } = useWindowSize();
  return (
    pour && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        recycle={false}
        onConfettiComplete={() =>
          setWelcomeMessage({
            header: 'Nice!',
            byline: 'Try adding your signature to your email account next.',
          })
        }
      />
    )
  );
};
