import {
  OptimizelyFeature,
  createInstance,
  OptimizelyProvider,
} from '@optimizely/react-sdk';
import React from 'react';

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_ROLLOUT,
});

const FeatureContext = React.createContext({});

const reducer = (state, action) => {
  switch (action) {
    case 'contactsSync':
      return { ...state, contactsSync: true };
    case 'gettingStarted':
      return { ...state, gettingStarted: true };
    default:
      throw new Error('Unexpected feature set');
  }
};

const FeatureProvider = ({ children, contactsSync, gettingStarted }) => {
  const [features, dispatch] = React.useReducer(reducer, {
    contactsSync: false,
    gettingStarted: false,
  });

  React.useEffect(() => {
    if (contactsSync) {
      dispatch('contactsSync');
    }

    if (gettingStarted) {
      dispatch('gettingStarted');
    }
  }, [contactsSync, gettingStarted]);

  return (
    <FeatureContext.Provider value={{ features }}>
      {children}
    </FeatureContext.Provider>
  );
};

export { FeatureContext };

// interface Props {
//   components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
//   children: React.ReactNode
// }

export default function FeatureFlags({ children, userId }) {
  return (
    <OptimizelyProvider
      optimizely={optimizely}
      user={{
        id: userId,
      }}
    >
      {/* <OptimizelyFeature feature="gettingStarted">
       {x => ( */}
      <OptimizelyFeature feature="contactsSync">
        {isEnabled => {
          console.log({ isEnabled });
          return (
            <FeatureProvider contactsSync={isEnabled} gettingStarted={false}>
              {children}
            </FeatureProvider>
          );
        }}
      </OptimizelyFeature>
      {/* )}
     </OptimizelyFeature> */}
    </OptimizelyProvider>
  );
}
