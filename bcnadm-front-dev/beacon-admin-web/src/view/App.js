import mainReducer from 'src/reducers/mainReducer';
import { Setup } from 'src/config/Setup';
import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { LocalizeProvider } from 'react-localize-redux';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';

import SessionFilter from './SessionFilter';

import './main.scss';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const store = createStore(mainReducer, enhancer);

export const App = () => {
  return (
    <Provider store={store}>
      <LocalizeProvider store={store}>
        <>
          <Setup />
          <BrowserRouter>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <SessionFilter />
            </ErrorBoundary>
          </BrowserRouter>
        </>
      </LocalizeProvider>
    </Provider>
  );
};
