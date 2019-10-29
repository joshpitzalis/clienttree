import React, { memo } from 'react';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import PropTypes from 'prop-types';
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

const propTypes = {
  setWelcomeMessage: PropTypes.func.isRequired,
};

const defaultProps = {};

export const ConfettiBanner = memo(({ setWelcomeMessage }) => {
  const [pour] = useConfetti(confetti$);
  const { width, height } = useWindowSize();
  return (
    pour && (
      <Confetti
        width={width}
        height={height}
        numberOfPieces={500}
        recycle={false}
        onConfettiComplete={() => {
          console.log('dog');

          setWelcomeMessage({
            header: 'Nice!',
            byline: 'Try adding your signature to your email account next.',
          });
        }}
      />
    )
  );
});

ConfettiBanner.displayName = 'ConfettiBanner';
ConfettiBanner.propTypes = propTypes;
ConfettiBanner.defaultProps = defaultProps;
